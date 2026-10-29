export function getEnv(key: string, fallback = "") {
  try {
    return (import.meta as any).env?.[key] ?? fallback;
  } catch {
    return fallback;
  }
}
