"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  images: string[];
  productName: string;
};

export function ProductImagesViewer({ images, productName }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="card-glow overflow-hidden p-4">
        <div
          className="relative h-[320px] overflow-hidden rounded-xl border border-white/10 bg-black/30 sm:h-[420px] cursor-pointer hover:opacity-90 transition"
          onClick={() => setSelectedImage(images[0])}
        >
          <Image
            src={images[0]}
            alt={productName}
            fill
            className="object-cover"
            priority
            loading="eager"
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative h-24 overflow-hidden rounded-lg border border-white/10 bg-black/30 cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(image)}
            >
              <Image src={image} alt={`${productName} ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Full size"
              width={1200}
              height={900}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              priority
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <button
              onClick={() => {
                const currentIndex = images.indexOf(selectedImage);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                setSelectedImage(images[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-white"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={() => {
                const currentIndex = images.indexOf(selectedImage);
                const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                setSelectedImage(images[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-white"
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
