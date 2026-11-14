"use client";

import React, { useCallback, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { IndexItem } from "@/data/portfolio";
import { UI } from "@/data/ui";

interface ProjectMediaProps {
  item: IndexItem;
  priority?: boolean;
}

export function ProjectMedia({ item, priority = false }: ProjectMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const t = UI.home;

  const handlePointerEnter = useCallback(() => {
    const video = videoRef.current;
    if (!video || !item.media.video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!video.src) {
      video.src = item.media.video;
    }
    video.play().catch(() => {});
  }, [item.media.video]);

  const handlePointerLeave = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(false);
    video.pause();
  }, []);

  const primaryHref = item.liveUrl ?? item.repoUrl;
  const pillLabel = item.liveUrl ? t.openLive : t.openCode;

  const stageContent = (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="work-stage aspect-[4/3] w-full"
      style={
        {
          backgroundColor: item.ground,
          "--card-accent": item.accent,
        } as React.CSSProperties
      }
    >
      <div className="work-stage__media relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.media.poster}
          alt={item.media.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover select-none"
        />

        {item.media.video && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setPlaying(true)}
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {primaryHref && (
        <span
          aria-hidden="true"
          className="work-stage__pill pointer-events-none absolute right-3.5 bottom-3.5 z-10 inline-flex items-center gap-1 rounded-full border border-white/18 bg-[#141619]/82 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md"
        >
          <span>{pillLabel}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  if (!primaryHref) {
    return stageContent;
  }

  return (
    <a
      href={primaryHref}
      target="_blank"
      rel="noreferrer"
      aria-label={`${pillLabel}: ${item.title}`}
      className="block rounded-[24px]"
    >
      {stageContent}
    </a>
  );
}
