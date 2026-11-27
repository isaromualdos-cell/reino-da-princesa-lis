// Content versions keep previews and saved photos on the same approved artwork.
const versions: Record<string, string> = {
  "1": "147764b8978c573e",
  "2": "fcc8b3d83f5f2f60",
  "3": "cc5f45df34c7387c",
  "4": "76f3404d01355392",
  "5": "9336599cfa741769"
};

export function frameAssetUrl(id: string, thumbnail = false) {
  const version = versions[id];
  if (!version) return null;
  const filename = thumbnail ? id + "-mini.webp" : id + ".png";
  return "/molduras/" + filename + "?v=" + version;
}
