import {
  isToddlerSpaceTabId,
  WONDERLAND_HISTORY_KEY,
  type ToddlerSpaceTabId,
} from "./toddlerSpaceTabs";

/** One history entry: a destination, plus an optional inner screen. */
export interface WonderlandPlace {
  tab: ToddlerSpaceTabId | null;
  game?: string | null;
  book?: string | null;
  show?: string | null;
  world?: string | null;
  area?: string | null;
  activity?: string | null;
}

export function emptyWonderlandPlace(): WonderlandPlace {
  return { tab: null };
}

export function readWonderlandPlace(state: unknown): WonderlandPlace {
  if (!state || typeof state !== "object") return emptyWonderlandPlace();
  const raw = (state as Record<string, unknown>)[WONDERLAND_HISTORY_KEY];
  if (isToddlerSpaceTabId(raw)) return { tab: raw };
  if (!raw || typeof raw !== "object") return emptyWonderlandPlace();
  const value = raw as Record<string, unknown>;
  const tab = isToddlerSpaceTabId(value.tab) ? value.tab : null;
  return {
    tab,
    game: typeof value.game === "string" ? value.game : null,
    book: typeof value.book === "string" ? value.book : null,
    show: typeof value.show === "string" ? value.show : null,
    world: typeof value.world === "string" ? value.world : null,
    area: typeof value.area === "string" ? value.area : null,
    activity: typeof value.activity === "string" ? value.activity : null,
  };
}

export function wonderlandPlacesEqual(a: WonderlandPlace, b: WonderlandPlace): boolean {
  return (
    a.tab === b.tab &&
    (a.game ?? null) === (b.game ?? null) &&
    (a.book ?? null) === (b.book ?? null) &&
    (a.show ?? null) === (b.show ?? null) &&
    (a.world ?? null) === (b.world ?? null) &&
    (a.area ?? null) === (b.area ?? null) &&
    (a.activity ?? null) === (b.activity ?? null)
  );
}

export function worldRouteFromPlace(place: WonderlandPlace): string | null {
  if (place.tab !== "worlds" || !place.world) return null;
  if (place.area && place.activity) return `world:${place.world}:${place.area}:${place.activity}`;
  if (place.area) return `world:${place.world}:${place.area}`;
  return place.world;
}

export function resetWonderlandScroll() {
  const root = (document.scrollingElement ?? document.documentElement) as HTMLElement | null;
  if (root) root.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scheduleWonderlandScrollReset() {
  window.requestAnimationFrame(() => {
    resetWonderlandScroll();
    window.requestAnimationFrame(() => resetWonderlandScroll());
  });
}
