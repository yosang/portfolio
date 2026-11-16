"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IndexItem } from "@/data/portfolio";
import { UI } from "@/data/ui";

interface ProjectMediaProps {
  item: IndexItem;
  priority?: boolean;
  linkToCase?: boolean;
  fullWidth?: boolean;
}

export function ProjectMedia({
  item,
  priority = false,
  linkToCase = true,
  fullWidth = false,
}: ProjectMediaProps) {
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
        <Image
          src={item.media.poster}
          alt={item.media.alt}
          width={1200}
          height={900}
          sizes={
            fullWidth
              ? "(min-width: 1024px) 1024px, 96vw"
              : "(min-width: 1024px) 464px, (min-width: 768px) 45vw, 92vw"
          }
          priority={priority}
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

      {linkToCase && (
        <span
          aria-hidden="true"
          className="work-stage__pill pointer-events-none absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#181514]/88 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
        >
          <span>{t.openCase}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  if (!linkToCase) {
    return stageContent;
  }

  return (
    <Link
      href={`/prosjekter/${item.slug}`}
      aria-label={`${t.openCase}: ${item.title}`}
      className="block rounded-[14px]"
    >
      {stageContent}
    </Link>
  );
}
