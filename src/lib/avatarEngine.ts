import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type AvatarMood = "neutral" | "happy" | "confused" | "thinking";
export type VisemeHint = "rest" | "aa" | "ee" | "oh";

export interface AvatarRuntimeState {
  pointerX: number;
  pointerY: number;
  mood: AvatarMood;
  energy: number;
  viseme: VisemeHint;
  speaking: boolean;
  idle: boolean;
  isHero: boolean;
}

interface DrivenBone {
  bone: THREE.Bone;
  restLocal: THREE.Quaternion;
  restWorld: THREE.Quaternion;
  restWorldInv: THREE.Quaternion;
  weight: number;
}

const _offset = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, "YXZ");
const _tmpQ = new THREE.Quaternion();

/**
 * Loads the user's Avaturn GLB (Mixamo-style rig) and drives it as a bust:
 * arms lowered from T-pose once, then Spine2/Neck/Head follow the cursor
 * through a spring-damper, with breathing, mood tilts, and speech nods.
 * Runs identically inside an OffscreenCanvas worker or on the main thread.
 */
export class GlbAvatarScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private model: THREE.Object3D | null = null;
  private driven: DrivenBone[] = [];
  private focus = new THREE.Vector3(0, 1.6, 0);
  private lastIsHero: boolean | null = null;

  private springYaw = { pos: 0, vel: 0 };
  private springPitch = { pos: 0, vel: 0 };
  private roll = 0;

  constructor(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    width: number,
    height: number,
    dpr: number
  ) {
    this.camera = new THREE.PerspectiveCamera(
      26,
      Math.max(1, width) / Math.max(1, height),
      0.1,
      10
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas as HTMLCanvasElement,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    this.renderer.shadowMap.enabled = false;
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(dpr, 1.5));
    this.renderer.setSize(width, height, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8478, 2.0));
    const key = new THREE.DirectionalLight(0xfff8f0, 2.15);
    key.position.set(-5, 7, 6);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xeef6ff, 0.85);
    fill.position.set(5, 3, 5);
    this.scene.add(fill);
  }

  async load(url: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(url);
    const root = gltf.scene;

    const bones: Record<string, THREE.Bone> = {};
    root.traverse((obj) => {
      if ((obj as THREE.Bone).isBone) bones[obj.name] = obj as THREE.Bone;
      const mesh = obj as THREE.SkinnedMesh;
      if (mesh.isMesh) {
        if (/shoe/i.test(mesh.name)) mesh.visible = false;
        mesh.frustumCulled = false;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });

    this.scene.add(root);
    root.updateMatrixWorld(true);

    // Lower both arms out of T-pose into a relaxed studio posture once
    for (const [armName, foreName] of [
      ["LeftArm", "LeftForeArm"],
      ["RightArm", "RightForeArm"],
    ]) {
      const arm = bones[armName];
      const fore = bones[foreName];
      if (!arm || !fore || !arm.parent) continue;
      const a = arm.getWorldPosition(new THREE.Vector3());
      const f = fore.getWorldPosition(new THREE.Vector3());
      const dir = f.sub(a).normalize();
      const side = Math.sign(dir.x) || 1;
      const target = new THREE.Vector3(side * 0.16, -1, 0.06).normalize();
      const delta = new THREE.Quaternion().setFromUnitVectors(dir, target);
      const armWorld = arm.getWorldQuaternion(new THREE.Quaternion());
      const parentWorld = arm.parent.getWorldQuaternion(new THREE.Quaternion());
      arm.quaternion.copy(parentWorld.invert().multiply(delta.multiply(armWorld)));
      arm.updateMatrixWorld(true);
    }
    root.updateMatrixWorld(true);

    for (const [name, weight] of [
      ["Spine2", 0.2],
      ["Neck", 0.3],
      ["Head", 0.5],
    ] as const) {
      const bone = bones[name];
      if (!bone) continue;
      const restWorld = bone.getWorldQuaternion(new THREE.Quaternion());
      this.driven.push({
        bone,
        restLocal: bone.quaternion.clone(),
        restWorld,
        restWorldInv: restWorld.clone().invert(),
        weight,
      });
    }

    const head = bones["Head"];
    if (head) {
      head.getWorldPosition(this.focus);
      this.focus.y -= 0.06;
    }
    this.model = root;
    this.frameCamera(true);
  }

  private frameCamera(isHero: boolean) {
    if (this.lastIsHero === isHero) return;
    this.lastIsHero = isHero;
    const dist = isHero ? 1.44 : 1.34;
    this.camera.position.set(this.focus.x, this.focus.y + 0.04, this.focus.z + dist);
    this.camera.lookAt(this.focus);
  }

  resize(width: number, height: number, dpr: number) {
    this.camera.aspect = Math.max(1, width) / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(dpr, 1.5));
    this.renderer.setSize(Math.max(1, width), Math.max(1, height), false);
  }

  pauseClock() {
    this.clock.stop();
  }

  resumeClock() {
    if (!this.clock.running) this.clock.start();
  }

  step(state: AvatarRuntimeState) {
    const dt = Math.min(this.clock.getDelta(), 0.04);
    const t = this.clock.elapsedTime;

    if (this.model) {
      this.frameCamera(state.isHero);

      const targetYaw = state.idle ? Math.sin(t * 0.35) * 0.42 : state.pointerX * 0.55;
      let targetPitch = state.idle ? -0.05 + Math.sin(t * 0.21) * 0.03 : state.pointerY * 0.32;
      let targetRoll = 0;
      if (!state.idle) {
        if (state.mood === "confused") targetRoll = 0.14;
        else if (state.mood === "thinking") {
          targetRoll = -0.08;
          targetPitch -= 0.08;
        } else if (state.mood === "happy") targetPitch -= 0.04;
      }

      const k = 120;
      const c = 16;
      this.springYaw.vel += ((targetYaw - this.springYaw.pos) * k - this.springYaw.vel * c) * dt;
      this.springYaw.pos += this.springYaw.vel * dt;
      this.springPitch.vel +=
        ((targetPitch - this.springPitch.pos) * k - this.springPitch.vel * c) * dt;
      this.springPitch.pos += this.springPitch.vel * dt;
      this.roll += (targetRoll - this.roll) * (1 - Math.exp(-6 * dt));

      const breath = Math.sin(t * 2.0) * 0.014;
      const nod = state.speaking
        ? Math.sin(t * 11) * state.energy * 0.06 + state.energy * 0.03
        : 0;
      const sway = state.speaking ? Math.sin(t * 5.3) * state.energy * 0.04 : 0;

      const pitch = this.springPitch.pos + breath + nod;
      const yaw = this.springYaw.pos + sway;

      for (const d of this.driven) {
        _euler.set(pitch * d.weight, yaw * d.weight, this.roll * d.weight);
        _offset.setFromEuler(_euler);
        _tmpQ.copy(d.restWorldInv).multiply(_offset).multiply(d.restWorld);
        d.bone.quaternion.copy(d.restLocal).multiply(_tmpQ);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        for (const v of Object.values(m)) {
          if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
        }
        m.dispose();
      }
    });
    this.renderer.dispose();
  }
}
