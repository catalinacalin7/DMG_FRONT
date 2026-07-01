"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  make: string;
  placeholder?: string;
  size?: number;
};

export function CarLogo({
  make,
  placeholder = "/no-logo.png",
  size = 96,
}: Props) {
  const [imgSrc, setImgSrc] = useState(
    `https://www.carlogos.org/logo/${make}-logo.png`,
  );

  return (
    <Image
      src={imgSrc}
      alt={`${make} logo`}
      width={96}
      height={96}
      className="object-contain"
      onError={() => setImgSrc(placeholder)}
      unoptimized
    />
  );
}
