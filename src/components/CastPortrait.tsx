import React from "react";
import { CAST } from "../data/toddler/toddlerWorldArt";

export function CastPortrait({
  who,
  size = 56,
  className = "",
  title,
}: {
  who: "pip" | "nana";
  size?: number;
  className?: string;
  title?: string;
}) {
  const name = who === "pip" ? "Pip" : "Nana";
  return (
    <img
      src={CAST[who]}
      alt={title ?? name}
      width={size}
      height={size}
      className={`rounded-full object-cover object-top ring-2 ring-white shadow-lg ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
