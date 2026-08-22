'use client';

// In-memory SPA routing flag:
// Resets automatically on Page Refresh (F5) or New Tab
// Persists across client-side Link navigations (Home -> Lessons -> Home)
let hasPlayedInSpaSession = false;

export function hasIntroPlayed(): boolean {
  return hasPlayedInSpaSession;
}

export function markIntroPlayed(): void {
  hasPlayedInSpaSession = true;
}

export function resetIntroState(): void {
  hasPlayedInSpaSession = false;
}
