"use client";

import React, { useEffect, useRef, useState } from "react";
import { portfolioAudio } from "@/lib/audioSynth";
import type {
  AvatarMood,
  AvatarRuntimeState,
  AvatarVariant,
  GlbAvatarScene,
} from "@/lib/avatarEngine";

export type { AvatarMood, AvatarVariant };

const MODEL_URL = "/avatar/yosmel.glb?v=gant-check-2";
let userHasInteracted = false;

interface AvatarStageProps {
  mood?: AvatarMood;
  variant?: AvatarVariant;
  className?: string;
  onClick?: () => void;
}

export function AvatarStage({
  mood = "neutral",
  variant = "widget",
  className = "",
  onClick,
}: AvatarStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const postPatchRef = useRef<
    ((patch: Partial<AvatarRuntimeState>) => void) | null
  >(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    postPatchRef.current?.({ mood, variant });
  }, [mood, variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    let disposed = false;
    let worker: Worker | null = null;
    let fallbackScene: GlbAvatarScene | null = null;
    let fallbackRaf = 0;
    let inViewport = true;
    let tabVisible = document.visibilityState === "visible";

    const state: AvatarRuntimeState = {
      pointerX: 0,
      pointerY: 0,
      mood,
      energy: 0,
      viseme: "rest",
      speaking: false,
      idle: false,
      variant,
    };

    const sendPatch = (patch: Partial<AvatarRuntimeState>) => {
      Object.assign(state, patch);
      worker?.postMessage({ type: "state", patch });
    };
    postPatchRef.current = sendPatch;

    const syncActiveRendering = () => {
      const active = inViewport && tabVisible && !disposed;
      if (worker) {
        worker.postMessage({ type: "visibility", visible: active });
      } else if (fallbackScene) {
        if (active && !fallbackRaf) {
          fallbackScene.resumeClock();
          const loop = () => {
            if (!inViewport || !tabVisible || disposed) {
              fallbackRaf = 0;
              return;
            }
            fallbackScene?.step(state);
            fallbackRaf = requestAnimationFrame(loop);
          };
          fallbackRaf = requestAnimationFrame(loop);
        } else if (!active && fallbackRaf) {
          cancelAnimationFrame(fallbackRaf);
          fallbackRaf = 0;
          fallbackScene.pauseClock();
        }
      }
    };

    const modelUrl = new URL(MODEL_URL, window.location.origin).href;
    let booted = false;
    let bootTimer: ReturnType<typeof setTimeout> | null = null;

    const startFallback = (target: HTMLCanvasElement) => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      const curDpr = Math.min(window.devicePixelRatio || 1, w < 120 ? 2 : 1.5);
      import("@/lib/avatarEngine")
        .then(({ GlbAvatarScene: SceneClass }) => {
          if (disposed) return;
          fallbackScene = new SceneClass(target, w, h, curDpr);
          return fallbackScene.load(modelUrl);
        })
        .then(() => {
          if (disposed || !fallbackScene) return;
          setLoaded(true);
          syncActiveRendering();
        })
        .catch((err) => console.error("Avatar failed to load:", err));
    };

    const bootEngine = () => {
      if (booted || disposed) return;
      booted = true;
      if (bootTimer) {
        clearTimeout(bootTimer);
        bootTimer = null;
      }
      removeBootListeners();

      const initW = Math.max(1, container.clientWidth);
      const initH = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, initW < 120 ? 2 : 1.5);

      if (
        typeof canvas.transferControlToOffscreen === "function" &&
        typeof Worker !== "undefined"
      ) {
        try {
          const offscreen = canvas.transferControlToOffscreen();
          worker = new Worker(
            new URL("../workers/avatar.worker.ts", import.meta.url),
            { type: "module" }
          );
          worker.onmessage = (ev: MessageEvent) => {
            if (ev.data?.type === "loaded") {
              setLoaded(true);
              syncActiveRendering();
            }
            if (ev.data?.type === "error") {
              console.error("Avatar worker failed:", ev.data.message);
              worker?.terminate();
              worker = null;
              if (canvas.parentNode === container) container.removeChild(canvas);
              const fresh = document.createElement("canvas");
              fresh.style.cssText = canvas.style.cssText;
              container.appendChild(fresh);
              startFallback(fresh);
            }
          };
          worker.postMessage(
            {
              type: "init",
              canvas: offscreen,
              width: initW,
              height: initH,
              dpr,
              modelUrl,
              initialState: state,
            },
            [offscreen]
          );
        } catch {
          worker = null;
        }
      }
      if (!worker && !fallbackScene) startFallback(canvas);
    };

    const onFirstInteraction = () => {
      userHasInteracted = true;
      bootEngine();
    };

    const removeBootListeners = () => {
      window.removeEventListener("pointermove", onFirstInteraction);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("wheel", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("load", scheduleAfterLoad);
    };

    const scheduleAfterLoad = () => {
      if (booted || disposed) return;
      bootTimer = setTimeout(bootEngine, 3500);
    };

    if (userHasInteracted || variant === "head" || variant === "widget") {
      bootEngine();
    } else {
      window.addEventListener("pointermove", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("pointerdown", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("touchstart", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("scroll", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("wheel", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("keydown", onFirstInteraction, { passive: true, once: true });
      if (document.readyState === "complete") {
        scheduleAfterLoad();
      } else {
        window.addEventListener("load", scheduleAfterLoad, { once: true });
      }
    }

    // Zero-reflow bounds tracking: read from IntersectionObserver & ResizeObserver only, never during scroll
    let cx = window.innerWidth * 0.65;
    let cy = window.innerHeight * 0.38;
    let vw = Math.max(1, window.innerWidth);
    let vh = Math.max(1, window.innerHeight);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        inViewport = entry.isIntersecting;
        if (entry.isIntersecting) {
          const r = entry.boundingClientRect;
          cx = r.left + r.width * 0.5;
          cy = r.top + r.height * 0.4;
        }
        syncActiveRendering();
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w === 0 || h === 0) {
        inViewport = false;
        syncActiveRendering();
        return;
      }
      const nextDpr = Math.min(window.devicePixelRatio || 1, w < 120 ? 2 : 1.5);
      vw = Math.max(1, window.innerWidth);
      vh = Math.max(1, window.innerHeight);
      const r = container.getBoundingClientRect();
      cx = r.left + r.width * 0.5;
      cy = r.top + r.height * 0.4;
      inViewport = r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
      if (worker) worker.postMessage({ type: "resize", width: w, height: h, dpr: nextDpr });
      else fallbackScene?.resize(w, h, nextDpr);
      syncActiveRendering();
    });
    ro.observe(container);

    let lastActivity = performance.now();
    let idle = false;
    let speaking = false;
    let pointerRaf = 0;
    let latestClientX = cx;
    let latestClientY = cy;

    const wakeUp = () => {
      lastActivity = performance.now();
      if (idle) {
        idle = false;
        sendPatch({ idle: false });
      }
    };

    const flushPointer = () => {
      pointerRaf = 0;
      if (!inViewport || !tabVisible || disposed) return;
      sendPatch({
        pointerX: Math.max(-1, Math.min(1, (latestClientX - cx) / (vw * 0.45))),
        pointerY: Math.max(-1, Math.min(1, (latestClientY - cy) / (vh * 0.45))),
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!inViewport || !tabVisible) return;
      wakeUp();
      latestClientX = e.clientX;
      latestClientY = e.clientY;
      if (!pointerRaf) {
        pointerRaf = requestAnimationFrame(flushPointer);
      }
    };

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      syncActiveRendering();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", wakeUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const idleTimer = setInterval(() => {
      if (!speaking && !idle && performance.now() - lastActivity > 12000) {
        idle = true;
        sendPatch({ idle: true });
      }
    }, 2000);

    const unsubAudio = portfolioAudio.subscribe((st) => {
      speaking = st.speaking;
      if (st.speaking) wakeUp();
      sendPatch({ energy: st.energy, viseme: st.viseme, speaking: st.speaking });
    });

    return () => {
      disposed = true;
      postPatchRef.current = null;
      if (bootTimer) clearTimeout(bootTimer);
      removeBootListeners();
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      clearInterval(idleTimer);
      unsubAudio();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", wakeUp);
      document.removeEventListener("visibilitychange", onVisibility);
      if (worker) {
        worker.postMessage({ type: "dispose" });
        worker.terminate();
      }
      if (fallbackRaf) cancelAnimationFrame(fallbackRaf);
      fallbackScene?.dispose();
      container.replaceChildren();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={onClick}
      className={`relative select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-1 w-10 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-white/60" />
          </span>
        </div>
      )}
    </div>
  );
}
