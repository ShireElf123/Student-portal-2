import React from "react";
import { CAST } from "../data/toddler/toddlerWorldArt";

export function CastPortrait({
  who = "pipCartoon",
  size = 56,
  className = "",
  title,
}: {
  who?: "pip" | "nana" | "pipCartoon";
  size?: number;
  className?: string;
  title?: string;
}) {
  const name = who === "nana" ? "Nana" : "Pip";
  const contain = who === "pipCartoon";
  return (
    <img
      src={CAST[who]}
      alt={title ?? name}
      width={size}
      height={size}
      className={`${contain ? "rounded-full object-contain bg-[#f6e7c1]" : "rounded-full object-cover object-top"} ring-2 ring-white shadow-lg ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
