export const cameraOpensAt = Date.parse("2026-11-28T16:00:00-03:00");

export function cameraIsOpen() {
  return Date.now() >= cameraOpensAt;
}
