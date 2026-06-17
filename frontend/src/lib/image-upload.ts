export const MAX_IMAGE_UPLOAD_COUNT = 10;

const MAX_SOURCE_IMAGE_BYTES = 20 * 1024 * 1024;
const TARGET_IMAGE_BYTES = 3 * 1024 * 1024;
const TARGET_MAX_DIMENSION = 1600;
const INITIAL_JPEG_QUALITY = 0.84;
const MIN_JPEG_QUALITY = 0.68;

function getUploadFileName(name: string): string {
  const baseName = name.replace(/\.[^.]+$/, "") || "product-image";
  return `${baseName}.jpg`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read image "${file.name}"`));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not optimize image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.ceil(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image`);
  }

  if (file.type === "image/svg+xml") {
    throw new Error("SVG files are not allowed for product photos");
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error(
      `${file.name} is too large (${formatFileSize(file.size)}). Use an image under ${formatFileSize(
        MAX_SOURCE_IMAGE_BYTES
      )}.`
    );
  }

  if (file.type === "image/gif") {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, TARGET_MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let quality = INITIAL_JPEG_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > TARGET_IMAGE_BYTES && quality > MIN_JPEG_QUALITY) {
    quality = Math.max(MIN_JPEG_QUALITY, quality - 0.08);
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size >= file.size && scale === 1 && file.size <= TARGET_IMAGE_BYTES) {
    return file;
  }

  return new File([blob], getUploadFileName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
