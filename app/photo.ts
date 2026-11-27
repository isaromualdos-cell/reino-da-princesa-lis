export async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

export async function compose(
  source: HTMLVideoElement | HTMLImageElement | null,
  frameUrl: string,
  mirror: boolean,
) {
  if (!source) throw new Error("Missing photo source");
  const isVideo = source instanceof HTMLVideoElement;
  const width = isVideo ? source.videoWidth : source.naturalWidth;
  const height = isVideo ? source.videoHeight : source.naturalHeight;
  // Exact 3:4 output preserves the preview crop. Bound the canvas for mobile Safari.
  const units = Math.floor(Math.min(width / 3, height / 4, 1024));
  if (units < 1) throw new Error("Source is not ready");
  const canvas = document.createElement("canvas");
  canvas.width = 3 * units;
  canvas.height = 4 * units;
  try {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas unavailable");
    const cropWidth = Math.min(width, height * 3 / 4);
    const cropHeight = Math.min(height, width * 4 / 3);
    ctx.imageSmoothingQuality = "high";
    ctx.save();
    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(source, (width - cropWidth) / 2, (height - cropHeight) / 2,
      cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    const frame = await loadImage(frameUrl);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(value => value ? resolve(value) : reject(new Error("Encoding failed")), "image/png");
    });
    return new File([blob], "reino-da-princesa-lis.png", { type: "image/png" });
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

export async function prepareAlbumPhoto(file: File) {
  const url = URL.createObjectURL(file);
  const canvas = document.createElement("canvas");
  try {
    const image = await loadImage(url);
    const units = Math.min(Math.floor(image.naturalWidth / 3), 540);
    canvas.width = units * 3;
    canvas.height = units * 4;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.92, 0.8, 0.65]) {
      const photo = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      if (photo?.type === "image/jpeg" && photo.size <= 4_000_000) return photo;
    }
    throw new Error("Photo exceeds upload limit");
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = 0;
    canvas.height = 0;
  }
}
