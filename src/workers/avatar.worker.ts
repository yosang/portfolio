import { GlbAvatarScene, type AvatarRuntimeState } from "@/lib/avatarEngine";

let engine: GlbAvatarScene | null = null;
let timerId: ReturnType<typeof setTimeout> | null = null;
let rafId = 0;
let visible = true;

const runtimeState: AvatarRuntimeState = {
  pointerX: 0,
  pointerY: 0,
  mood: "neutral",
  energy: 0,
  viseme: "rest",
  speaking: false,
  idle: false,
  isHero: false,
};

function cancelLoop() {
  if (timerId) clearTimeout(timerId);
  timerId = null;
  if (rafId && typeof self.cancelAnimationFrame === "function") {
    self.cancelAnimationFrame(rafId);
  }
  rafId = 0;
}

function tick() {
  engine?.step(runtimeState);
  scheduleLoop();
}

function scheduleLoop() {
  if (!engine || !visible) return;
  // Idle head-scanning is slow, so ~22fps is plenty; full rate otherwise
  if (runtimeState.idle && !runtimeState.speaking) {
    timerId = setTimeout(tick, 45);
  } else if (typeof self.requestAnimationFrame === "function") {
    rafId = self.requestAnimationFrame(tick);
  } else {
    timerId = setTimeout(tick, 16);
  }
}

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  if (!msg || typeof msg !== "object") return;

  switch (msg.type) {
    case "init": {
      if (msg.initialState) Object.assign(runtimeState, msg.initialState);
      engine = new GlbAvatarScene(
        msg.canvas as OffscreenCanvas,
        msg.width,
        msg.height,
        msg.dpr
      );
      try {
        await engine.load(msg.modelUrl);
        self.postMessage({ type: "loaded" });
        scheduleLoop();
      } catch (err) {
        self.postMessage({ type: "error", message: String(err) });
      }
      break;
    }
    case "resize":
      engine?.resize(msg.width, msg.height, msg.dpr);
      break;
    case "state":
      Object.assign(runtimeState, msg.patch);
      break;
    case "visibility": {
      const next = Boolean(msg.visible);
      if (next !== visible) {
        visible = next;
        if (visible) {
          engine?.resumeClock();
          scheduleLoop();
        } else {
          cancelLoop();
          engine?.pauseClock();
        }
      }
      break;
    }
    case "dispose":
      cancelLoop();
      engine?.dispose();
      engine = null;
      break;
  }
};
