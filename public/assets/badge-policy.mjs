export function badgePolicy({ reducedMotion, saveData, webglAvailable }) {
  return !reducedMotion && !saveData && webglAvailable;
}
