"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const DEFAULT_PRODUCT_IMAGE = "/items/laptop.svg";

type SafeImageProps = Omit<ImageProps, "alt" | "src" | "onError"> & {
  alt: string;
  src?: string | null;
  fallbackSrc?: string;
};

function getSafeSrc(src: string | null | undefined, fallbackSrc: string): string {
  return src && src.trim() ? src : fallbackSrc;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = DEFAULT_PRODUCT_IMAGE,
  ...props
}: SafeImageProps) {
  const safeSrc = getSafeSrc(src, fallbackSrc);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const currentSrc = failedSrc === safeSrc ? fallbackSrc : safeSrc;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setFailedSrc(safeSrc);
        }
      }}
    />
  );
}
