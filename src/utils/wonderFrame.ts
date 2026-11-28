import { useEffect, useState } from "react";

export type WonderFrame = "pocket" | "tablet" | "wide";
export type WonderOrientation = "portrait" | "landscape";

export type WonderViewportSnapshot = {
  innerWidth: number;
  innerHeight: number;
  screenWidth: number;
  screenHeight: number;
  orientation: WonderOrientation;
  hoverFine: boolean;
};

export type WonderFrameState = {
  frame: WonderFrame;
  orientation: WonderOrientation;
};

const SPOOF_RATIO = 1.25;
const PHONE_SHORT_MAX = 700;
const TABLET_SHORT_MIN = 600;
const WIDE_MIN = 1024;

export function captureWonderViewport(): WonderViewportSnapshot {
  const innerWidth = window.innerWidth || 360;
  const innerHeight = window.innerHeight || 640;
  const screenWidth = window.screen?.width || innerWidth;
  const screenHeight = window.screen?.height || innerHeight;
  const landscape =
    window.matchMedia?.("(orientation: landscape)")?.matches ?? innerWidth > innerHeight;
  const hoverFine = Boolean(window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches);
  return {
    innerWidth,
    innerHeight,
    screenWidth,
    screenHeight,
    orientation: landscape ? "landscape" : "portrait",
    hoverFine,
  };
}

export function readWonderFrame(snap?: WonderViewportSnapshot): WonderFrameState {
  const s = snap ?? captureWonderViewport();
  const physicalShort = Math.min(s.screenWidth, s.screenHeight) || Math.min(s.innerWidth, s.innerHeight);
  const spoofed = s.screenWidth > 0 && s.innerWidth > s.screenWidth * SPOOF_RATIO;

  // Chrome "desktop site" on a phone reports ~980px CSS width, then scales the
  // page down. Keep pocket layout so picture-cards stay toddler-tappable.
  if (spoofed && physicalShort < PHONE_SHORT_MAX) {
    return { frame: "pocket", orientation: s.orientation };
  }

  if (physicalShort >= WIDE_MIN || (s.hoverFine && !spoofed && s.innerWidth >= WIDE_MIN)) {
    return { frame: "wide", orientation: s.orientation };
  }

  if (physicalShort >= TABLET_SHORT_MIN || (!spoofed && s.innerWidth >= TABLET_SHORT_MIN)) {
    return { frame: "tablet", orientation: s.orientation };
  }

  return { frame: "pocket", orientation: s.orientation };
}

export function useWonderFrame(): WonderFrameState {
  const [state, setState] = useState<WonderFrameState>(() =>
    typeof window === "undefined" ? { frame: "pocket", orientation: "portrait" } : readWonderFrame(),
  );

  useEffect(() => {
    const update = () => setState(readWonderFrame());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const hoverMq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const oriMq = window.matchMedia?.("(orientation: landscape)");
    hoverMq?.addEventListener?.("change", update);
    oriMq?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      hoverMq?.removeEventListener?.("change", update);
      oriMq?.removeEventListener?.("change", update);
    };
  }, []);

  return state;
}
