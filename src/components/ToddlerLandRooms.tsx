import React, { useEffect, useRef, useState } from "react";
import { soundEffects } from "../utils/soundEffects";
import { speakText, stopSpeaking } from "../utils/speechUtils";
import { triggerCelebrationConfetti } from "../utils/gamification";

export type LandPlayId =
  | "milk-cow"
  | "firefly-jar"
  | "penguin-slide"
  | "load-truck"
  | "fire-hose"
  | "fruit-stack"
  | "stamp-mural"
  | "story-stones"
  | "number-pebbles"
  | "campfire"
  | "feeling-face"
  | "night-tuck"
  | "vine-swing"
  | "dew-web"
  | "seal-clap"
  | "wash-bus"
  | "pigeon-feed"
  | "knead-dough"
  | "drum-boom"
  | "rocket-stars"
  | "ten-dots"
  | "puddle-jump"
  | "brush-teeth"
  | "owl-hoot"
  | "puppet-bow"
  | "syllable-clap"
  | "rain-boots"
  | "water-can"
  | "set-table"
  | "pack-bag"
  | "nest-eggs"
  | "stack-cups"
  | "shelf-books"
  | "feed-fish"
  | "hang-stars"
  | "fish-toss"
  | "coil-rope"
  | "bag-market"
  | "scoop-moon"
  | "pancake-flip"
  | "hang-wash";

const COPY: Record<LandPlayId, { title: string; line: string; done: string }> = {
  "milk-cow": { title: "Milk the cow", line: "Hold the pail. Fill it to the top.", done: "Warm milk for the barn!" },
  "firefly-jar": { title: "Catch fireflies", line: "Tap six glow-bugs into the jar.", done: "A lantern of tiny stars!" },
  "penguin-slide": { title: "Penguin slide", line: "Slide the penguin down to the fish hole.", done: "Splash! A fish for lunch!" },
  "load-truck": { title: "Load the truck", line: "Drag four crates onto the truck.", done: "All loaded. Ready to roll!" },
  "fire-hose": { title: "Hang the hoses", line: "Hold the hose. Drag water onto each flame.", done: "The fire house is calm." },
  "fruit-stack": { title: "Stack the stall", line: "Drag fruit onto the plate. Fill five.", done: "A market tower!" },
  "stamp-mural": { title: "Stamp a mural", line: "Drag a stamp onto the wall. Six prints.", done: "A wall full of colour!" },
  "story-stones": { title: "Story stones", line: "Tell the tale. Tap each stone in order.", done: "Once upon a time… you told it!" },
  "number-pebbles": { title: "Number pebbles", line: "Tap the pebbles from 1 to 10.", done: "The meadow counted with you!" },
  campfire: { title: "Build a campfire", line: "Drag four logs onto the stones, then strike a spark.", done: "Warm light on the trail." },
  "feeling-face": { title: "Make a feeling", line: "Pick eyes, then a mouth.", done: "That face has a feeling!" },
  "night-tuck": { title: "Tuck in for night", line: "Close three shutters, then hug teddy.", done: "Quiet house. Sweet sleep." },
  "vine-swing": { title: "Swing the vine", line: "Hold the vine. Swing across.", done: "Wheee across the canopy!" },
  "dew-web": { title: "Dew on the web", line: "Drag the drops along the web.", done: "The web sparkles." },
  "seal-clap": { title: "Seal clap", line: "Hold. Clap with the seal.", done: "Clap clap clap!" },
  "wash-bus": { title: "Wash the bus", line: "Drag the sponge over the dirt.", done: "Shiny bus. Beep beep!" },
  "pigeon-feed": { title: "Feed the pigeons", line: "Drag crumbs to the birds.", done: "Coo! Full tummies." },
  "knead-dough": { title: "Knead the dough", line: "Hold to press the dough.", done: "Soft bread ready." },
  "drum-boom": { title: "Boom the drums", line: "Tap the drums from 1 to 8.", done: "A parade beat!" },
  "rocket-stars": { title: "Star the rocket", line: "Drag five stars onto the rocket, then hold to launch.", done: "Whoosh to the moon!" },
  "ten-dots": { title: "Fill the ten-frame", line: "Drag ten counters onto the frame.", done: "Ten. A full frame!" },
  "puddle-jump": { title: "Puddle jump", line: "Drag the boot through the puddles.", done: "Wet boots. Big grin." },
  "brush-teeth": { title: "Brush, brush", line: "Drag the brush across the teeth.", done: "Clean shiny teeth." },
  "owl-hoot": { title: "Owl hoot", line: "Hold to hoot. Three long hoots.", done: "Hoo hoo hoo." },
  "puppet-bow": { title: "Puppet bow", line: "Pull each puppet down for a bow.", done: "The nook claps!" },
  "syllable-clap": { title: "Clap ba-na-na", line: "Hold three beats. Ba. Na. Na.", done: "Ba. Na. Na!" },
  "rain-boots": { title: "Rain boots", line: "Drag the boot through the puddles.", done: "Splash all the way home." },
  "water-can": { title: "Water the bed", line: "Drag the can onto every thirsty plant.", done: "The garden drinks!" },
  "set-table": { title: "Set the table", line: "Drag plate, cup, spoon, and napkin onto the cloth.", done: "Supper is ready." },
  "pack-bag": { title: "Pack the bag", line: "Drag four trip things into the bag.", done: "Packed. Ready to go!" },
  "nest-eggs": { title: "Warm the nest", line: "Drag four eggs into the nest.", done: "Safe and warm." },
  "stack-cups": { title: "Stack the cups", line: "Drag five cups onto the tower.", done: "A wobbly tower!" },
  "shelf-books": { title: "Shelf the books", line: "Drag four books onto the shelf.", done: "The nook is tidy." },
  "feed-fish": { title: "Feed the reef", line: "Drag flakes onto every fish.", done: "Full tummies in the coral." },
  "hang-stars": { title: "Hang the stars", line: "Drag five stars onto the night.", done: "The balcony glows." },
  "fish-toss": { title: "Toss a fish", line: "Drag four fish to the seal.", done: "Catch! The seal is glad." },
  "coil-rope": { title: "Coil the ropes", line: "Drag four ropes onto the bollard.", done: "The dock is tidy." },
  "bag-market": { title: "Fill the market bag", line: "Drag four stall things into the bag.", done: "Home with the shopping!" },
  "scoop-moon": { title: "Scoop moon dust", line: "Drag four scoops into the tin.", done: "Dust for the rocket." },
  "pancake-flip": { title: "Flip pancakes", line: "Pour. Wait until gold. Flip four onto the plate.", done: "A Saturday stack!" },
  "hang-wash": { title: "Hang the wash", line: "Drag four clothes up onto the line.", done: "Pegged. The wind can work." },
};


function useCredit(onAddStar?: () => void) {
  const credited = useRef(false);
  const star = useRef(onAddStar);
  star.current = onAddStar;
  const [done, setDone] = useState(false);
  const finish = useRef(() => {
    if (credited.current) return;
    credited.current = true;
    setDone(true);
    soundEffects.playFanfare();
    triggerCelebrationConfetti();
    star.current?.();
  }).current;
  return { done, finish };
}

const SCENERY: Record<LandPlayId, string[]> = {
  "milk-cow": ["☁️", "🏡", "🌾", "🌻", "🌳"],
  "firefly-jar": ["🌙", "🌸", "🌿", "⭐", "🍃"],
  "penguin-slide": ["❄️", "❄️", "🌨️", "🐟", "🏔️"],
  "load-truck": ["🛢️", "🔧", "🚗", "🚧", "📦"],
  "fire-hose": ["🚒", "🔔", "🏡", "💧", "🚒"],
  "fruit-stack": ["👜", "🍋", "🍉", "🥕", "🌽"],
  "stamp-mural": ["🎨", "🖌️", "🌈", "✨", "🖼️"],
  "story-stones": ["📖", "🌙", "🏡", "⭐", "🌲"],
  "number-pebbles": ["🌼", "🍃", "🦋", "⛰️", "☀️"],
  campfire: ["🌲", "🦉", "🌙", "⭐", "🏕️"],
  "feeling-face": ["💗", "🌼", "🌈", "🧸", "☀️"],
  "night-tuck": ["🌙", "⭐", "🦉", "🛏️", "🕯️"],
  "vine-swing": ["🌴", "🦜", "🍃", "🍌", "☀️"],
  "dew-web": ["🕸️", "💧", "🌿", "🐛", "🌸"],
  "seal-clap": ["🐬", "❄️", "❄️", "🌊", "🐟"],
  "wash-bus": ["🚌", "🛁", "💧", "☀️", "🚗"],
  "pigeon-feed": ["🕊️", "🍞", "🌳", "💺", "🌤️"],
  "knead-dough": ["🍞", "🌾", "🥣", "🔥", "🍞"],
  "drum-boom": ["🥁", "🎵", "🌈", "🎺", "⭐"],
  "rocket-stars": ["🚀", "🌙", "⭐", "🌍", "✨"],
  "ten-dots": ["🔟", "🌼", "📗", "⭐", "🔷"],
  "puddle-jump": ["🌧️", "🌈", "🌲", "💧", "☔"],
  "brush-teeth": ["😁", "😁", "💧", "🌙", "⭐"],
  "owl-hoot": ["🦉", "🌙", "🌲", "⭐", "🌳"],
  "puppet-bow": ["🎭", "🎪", "🌟", "🎀", "👏"],
  "syllable-clap": ["👏", "🐟", "🔤", "💧", "🌙"],
  "rain-boots": ["👢", "🌧️", "🏠", "☕", "☂️"],
  "water-can": ["🌱", "💧", "🐞", "🌸", "🌤️"],
  "set-table": ["🍽️", "🕯️", "👜", "🍞", "🏡"],
  "pack-bag": ["🎒", "🎫", "✈️", "👟", "📘"],
  "nest-eggs": ["🦕", "🌿", "🥚", "⛰️", "☀️"],
  "stack-cups": ["🔷", "🔶", "⭐", "📗", "🎲"],
  "shelf-books": ["📚", "🕯️", "🏠", "💺", "🌙"],
  "feed-fish": ["🐠", "🌊", "🌊", "💧", "🐚"],
  "hang-stars": ["⭐", "🌙", "🌃", "✨", "🦉"],
  "fish-toss": ["🐬", "🐟", "❄️", "🌊", "❄️"],
  "coil-rope": ["⚓", "🚢", "➰", "🌊", "🌳"],
  "bag-market": ["🛍️", "🥕", "🍞", "🧀", "🌞"],
  "scoop-moon": ["🚀", "🌕", "✨", "🌍", "🛰️"],
  "pancake-flip": ["🥞", "🍞", "🍓", "🔥", "☕"],
  "hang-wash": ["👕", "👟", "👜", "🌤️", "🏡"],
};


function Stage({
  playId,
  className,
  children,
  done,
}: {
  playId: LandPlayId;
  className: string;
  children: React.ReactNode;
  done: boolean;
}) {
  const copy = COPY[playId] ?? { title: "This land's room", line: "Pick another Play on the trail.", done: "All done." };
  useEffect(() => {
    const t = setTimeout(
      () =>
        speakText(copy.line, {
          pitch: 1.2,
          rate: 0.92,
          closedKit: playId === "milk-cow" || playId === "vine-swing" || playId === "feed-fish",
        }),
      180,
    );
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [copy.line]);
  useEffect(() => {
    if (done) {
      speakText(copy.done, {
        pitch: 1.22,
        closedKit: playId === "milk-cow" || playId === "vine-swing" || playId === "feed-fish",
      });
    }
  }, [done, copy.done]);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border-4 border-amber-100/90 min-h-[28rem] sm:min-h-[32rem] p-4 sm:p-6 shadow-[0_18px_40px_rgba(40,20,0,0.22)] ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 18% 0%, rgba(255,255,255,0.55), transparent 46%), radial-gradient(ellipse at 90% 100%, rgba(120,70,20,0.18), transparent 40%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {SCENERY[playId].map((bit, index) => (
          <span
            key={`${bit}-${index}`}
            className="absolute text-3xl sm:text-4xl opacity-40"
            style={{ top: `${10 + (index * 16) % 62}%`, left: `${8 + (index * 18) % 78}%` }}
          >
            {bit}
          </span>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-black/10" />
      </div>
      <div className="relative z-10">
        <div className="text-center mb-3">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/70">This land’s room</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow">{copy.title}</h3>
          <p className="text-white/90 text-sm sm:text-base font-bold">{done ? copy.done : copy.line}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function MilkCow({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [fill, setFill] = useState(6);
  const holding = useRef(false);
  const fillRef = useRef(6);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (!holding.current) return;
      fillRef.current = Math.min(100, fillRef.current + 4);
      setFill(fillRef.current);
      if (fillRef.current % 20 < 4) soundEffects.playPop();
      if (fillRef.current >= 100) {
        holding.current = false;
        finish();
      }
    }, 70);
    return () => window.clearInterval(tick);
  }, [finish]);

  return (
    <Stage playId="milk-cow" done={done} className="bg-gradient-to-b from-lime-300 via-emerald-600 to-amber-900">
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl sm:text-8xl animate-bounce" aria-hidden>
          🐄
        </div>
        <div
          className="relative h-40 w-24 rounded-b-[2rem] rounded-t-lg border-4 border-amber-100 bg-white/20 overflow-hidden"
          data-testid="milk-pail"
          aria-valuenow={fill}
          role="progressbar"
        >
          <div className="absolute bottom-0 left-0 right-0 bg-amber-50 transition-all" style={{ height: `${fill}%` }} />
        </div>
        <button
          type="button"
          data-testid="milk-hold"
          className="min-h-16 min-w-[14rem] rounded-full bg-amber-100 px-10 py-5 text-xl font-black text-amber-950 shadow-lg active:scale-95"
          onPointerDown={() => {
            holding.current = true;
          }}
          onPointerUp={() => {
            holding.current = false;
          }}
          onPointerLeave={() => {
            holding.current = false;
          }}
        >
          {done ? "Full!" : "Hold to milk"}
        </button>
      </div>
    </Stage>
  );
}

const FIREFLIES = [
  { id: "a", top: "18%", left: "12%" },
  { id: "b", top: "22%", left: "72%" },
  { id: "c", top: "38%", left: "28%" },
  { id: "d", top: "44%", left: "58%" },
  { id: "e", top: "58%", left: "16%" },
  { id: "f", top: "62%", left: "78%" },
  { id: "g", top: "30%", left: "46%" },
  { id: "h", top: "70%", left: "42%" },
];

function FireflyJar({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [caught, setCaught] = useState<string[]>([]);
  const catchOne = (id: string) => {
    setCaught((prev) => {
      if (prev.includes(id) || prev.length >= 6) return prev;
      const next = [...prev, id];
      soundEffects.playPop();
      if (next.length >= 6) finish();
      return next;
    });
  };
  return (
    <Stage playId="firefly-jar" done={done} className="bg-gradient-to-b from-indigo-950 via-violet-900 to-emerald-950">
      <div className="relative h-80 sm:h-96">
        {FIREFLIES.map((bug) =>
          caught.includes(bug.id) ? null : (
            <button
              key={bug.id}
              type="button"
              data-testid={`firefly-${bug.id}`}
              aria-label={`Catch firefly ${bug.id}`}
              className="absolute text-3xl animate-pulse"
              style={{ top: bug.top, left: bug.left }}
              onClick={() => catchOne(bug.id)}
            >
              ✨
            </button>
          )
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-6xl" aria-hidden>
            🍯
          </div>
          <p className="text-amber-200 font-black" data-testid="firefly-count">
            {caught.length} of 6
          </p>
        </div>
      </div>
    </Stage>
  );
}

function PenguinSlide({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [y, setY] = useState(8);
  const dragging = useRef(false);
  return (
    <Stage playId="penguin-slide" done={done} className="bg-gradient-to-b from-sky-200 via-cyan-400 to-blue-800">
      <div
        className="relative mx-auto h-80 w-full max-w-sm touch-none"
        data-testid="penguin-slope"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const box = event.currentTarget.getBoundingClientRect();
          const next = Math.max(8, Math.min(86, ((event.clientY - box.top) / box.height) * 100));
          setY(next);
          if (next > 72) finish();
        }}
      >
        <div className="absolute left-1/2 top-4 h-[90%] w-16 -translate-x-1/2 rounded-full bg-white/70 rotate-[-8deg]" />
        <button
          type="button"
          className="absolute text-5xl"
          style={{ top: `${y}%`, left: "42%" }}
          data-testid="penguin"
          onClick={() => {
            setY((value) => {
              const next = Math.min(86, value + 22);
              if (next > 72) finish();
              return next;
            });
            soundEffects.playPop();
          }}
        >
          🐧
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-4xl" data-testid="fish-hole">
          🕳️🐟
        </div>
      </div>
    </Stage>
  );
}


function pointerHits(el: HTMLElement | null, clientX: number, clientY: number, pad = 36) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return clientX >= rect.left - pad && clientX <= rect.right + pad && clientY >= rect.top - pad && clientY <= rect.bottom + pad;
}

function DragFollowGhost({ ghost }: { ghost: { emoji: string; x: number; y: number } | null }) {
  if (!ghost) return null;
  return (
    <span
      data-testid="drag-ghost"
      aria-hidden
      className="pointer-events-none fixed z-[200] select-none text-6xl drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
      style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%, -50%)" }}
    >
      {ghost.emoji}
    </span>
  );
}

type DragToken = string | number;

function bindFollowDrag(
  dragging: React.MutableRefObject<DragToken | null>,
  id: DragToken,
  emoji: string,
  setGhost: React.Dispatch<React.SetStateAction<{ emoji: string; x: number; y: number } | null>>,
  drop: (id: DragToken, x: number, y: number) => boolean,
  alreadyHeld: () => boolean,
) {
  return {
    onPointerDown: (event: React.PointerEvent) => {
      dragging.current = id;
      setGhost({ emoji, x: event.clientX, y: event.clientY });
      event.currentTarget.setPointerCapture?.(event.pointerId);
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (dragging.current !== id) return;
      setGhost({ emoji, x: event.clientX, y: event.clientY });
    },
    onPointerUp: (event: React.PointerEvent) => {
      if (dragging.current !== id) return;
      const ok = drop(id, event.clientX, event.clientY);
      dragging.current = null;
      setGhost(null);
      if (!ok && !alreadyHeld()) soundEffects.playGentleBoing();
    },
    onPointerCancel: () => {
      if (dragging.current !== id) return;
      dragging.current = null;
      setGhost(null);
    },
  };
}

function DragBits({
  playId,
  className,
  bits,
  targetTestId,
  targetIdle,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  bits: { id: string; emoji: string }[];
  targetTestId: string;
  targetIdle: string;
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [held, setHeld] = useState<string[]>([]);
  const heldRef = useRef<string[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const drop = (id: DragToken, clientX: number, clientY: number) => {
    const bitId = String(id);
    if (heldRef.current.includes(bitId)) return true;
    if (!pointerHits(targetRef.current, clientX, clientY, 48)) return false;
    heldRef.current = [...heldRef.current, bitId];
    setHeld(heldRef.current);
    soundEffects.playPop();
    if (heldRef.current.length >= bits.length) finish();
    return true;
  };

  return (
    <Stage playId={playId} done={done} className={className}>
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-6">
        <div ref={targetRef} data-testid={targetTestId} className="min-h-24 min-w-32 text-center text-7xl">
          {targetIdle}
          <span className="block text-3xl">{held.map((id) => bits.find((bit) => bit.id === id)?.emoji).join("")}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {bits.map((bit) =>
            held.includes(bit.id) ? (
              <span key={bit.id} className="min-h-16 min-w-16 text-5xl opacity-20">
                {bit.emoji}
              </span>
            ) : (
              <button
                key={bit.id}
                type="button"
                data-testid={`bit-${bit.id}`}
                className="min-h-16 min-w-16 text-5xl touch-none"
                {...bindFollowDrag(dragging, bit.id, bit.emoji, setGhost, drop, () => heldRef.current.includes(bit.id))}
              >
                {bit.emoji}
              </button>
            )
          )}
        </div>
      </div>
    </Stage>
  );
}

function DragToolSpots({
  playId,
  className,
  toolTestId,
  tool,
  spots,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  toolTestId: string;
  tool: string;
  spots: { id: string; emoji: string }[];
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [hit, setHit] = useState<string[]>([]);
  const hitRef = useRef<string[]>([]);
  const spraying = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const spray = (clientX: number, clientY: number) => {
    if (!spraying.current || !stageRef.current) return;
    for (const spot of spots) {
      if (hitRef.current.includes(spot.id)) continue;
      const el = stageRef.current.querySelector<HTMLElement>(`[data-testid="spot-${spot.id}"]`);
      if (!pointerHits(el, clientX, clientY, 44)) continue;
      hitRef.current = [...hitRef.current, spot.id];
      setHit(hitRef.current);
      soundEffects.playPop();
      if (hitRef.current.length >= spots.length) finish();
    }
  };

  return (
    <Stage playId={playId} done={done} className={className}>
      <DragFollowGhost ghost={ghost} />
      <div ref={stageRef} className="space-y-4">
        <button
          type="button"
          data-testid={toolTestId}
          className="mx-auto mb-4 block min-h-16 rounded-full bg-white/20 px-8 py-4 text-5xl touch-none"
          onPointerDown={(event) => {
            spraying.current = true;
            setGhost({ emoji: tool, x: event.clientX, y: event.clientY });
            event.currentTarget.setPointerCapture?.(event.pointerId);
            spray(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (!spraying.current) return;
            setGhost({ emoji: tool, x: event.clientX, y: event.clientY });
            spray(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            spraying.current = false;
            setGhost(null);
          }}
          onPointerCancel={() => {
            spraying.current = false;
            setGhost(null);
          }}
        >
          {tool}
        </button>
        <div className="flex justify-around items-end h-40">
          {spots.map((spot) => (
            <div key={spot.id} data-testid={`spot-${spot.id}`} className="min-h-20 min-w-20 text-center text-6xl">
              {hit.includes(spot.id) ? "✨" : spot.emoji}
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function LoadTruck({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [loaded, setLoaded] = useState<number[]>([]);
  const loadedRef = useRef<number[]>([]);
  const bedRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);
  const crates = [0, 1, 2, 3];

  const drop = (crate: DragToken, clientX: number, clientY: number) => {
    const n = Number(crate);
    if (loadedRef.current.includes(n)) return true;
    if (!pointerHits(bedRef.current, clientX, clientY)) return false;
    loadedRef.current = [...loadedRef.current, n];
    setLoaded(loadedRef.current);
    soundEffects.playPop();
    if (loadedRef.current.length >= 4) finish();
    return true;
  };

  return (
    <Stage playId="load-truck" done={done} className="bg-gradient-to-b from-amber-200 via-orange-400 to-stone-800">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-6">
        <div ref={bedRef} className="text-7xl min-h-24 min-w-40 text-center" data-testid="truck-bed">
          🚚
          <span className="text-2xl align-top">{loaded.map(() => "📦").join("")}</span>
        </div>
        <div className="flex gap-3">
          {crates.map((crate) =>
            loaded.includes(crate) ? (
              <span key={crate} className="min-h-16 min-w-16 opacity-20 text-5xl">
                📦
              </span>
            ) : (
              <button
                key={crate}
                type="button"
                data-testid={`crate-${crate}`}
                className="min-h-16 min-w-16 text-5xl touch-none"
                {...bindFollowDrag(dragging, crate, "📦", setGhost, drop, () => loadedRef.current.includes(crate))}
              >
                📦
              </button>
            )
          )}
        </div>
      </div>
    </Stage>
  );
}

function FireHose({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [out, setOut] = useState<number[]>([]);
  const outRef = useRef<number[]>([]);
  const spraying = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const spray = (clientX: number, clientY: number) => {
    if (!spraying.current || !stageRef.current) return;
    for (const flame of [0, 1, 2]) {
      if (outRef.current.includes(flame)) continue;
      const el = stageRef.current.querySelector<HTMLElement>(`[data-testid="flame-${flame}"]`);
      if (!pointerHits(el, clientX, clientY, 44)) continue;
      outRef.current = [...outRef.current, flame];
      setOut(outRef.current);
      soundEffects.playPop();
      if (outRef.current.length >= 3) finish();
    }
  };

  return (
    <Stage playId="fire-hose" done={done} className="bg-gradient-to-b from-rose-400 via-red-700 to-slate-900">
      <DragFollowGhost ghost={ghost} />
      <div ref={stageRef} className="space-y-4">
        <button
          type="button"
          data-testid="hose"
          className="mx-auto mb-4 block min-h-16 rounded-full px-8 py-4 text-xl font-black bg-sky-200 text-sky-950 touch-none"
          onPointerDown={(event) => {
            spraying.current = true;
            setGhost({ emoji: "💧", x: event.clientX, y: event.clientY });
            event.currentTarget.setPointerCapture?.(event.pointerId);
            soundEffects.playPop();
            spray(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (!spraying.current) return;
            setGhost({ emoji: "💧", x: event.clientX, y: event.clientY });
            spray(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            spraying.current = false;
            setGhost(null);
          }}
          onPointerCancel={() => {
            spraying.current = false;
            setGhost(null);
          }}
        >
          Hold the hose
        </button>
        <div className="flex justify-around items-end h-56">
          {[0, 1, 2].map((flame) => (
            <div key={flame} data-testid={`flame-${flame}`} className="min-h-20 min-w-20 text-6xl text-center">
              {out.includes(flame) ? "💧" : "🔥"}
            </div>
          ))}
        </div>
        <p className="text-center text-white/80 font-black">Drag water onto every flame</p>
      </div>
    </Stage>
  );
}

const FRUIT = ["🍎", "🍊", "🍌", "🍇", "🍐"];

function FruitStack({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [stack, setStack] = useState<string[]>([]);
  const stackRef = useRef<string[]>([]);
  const plateRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const drop = (fruit: DragToken, clientX: number, clientY: number) => {
    const token = String(fruit);
    if (stackRef.current.includes(token) || stackRef.current.length >= 5) return true;
    if (!pointerHits(plateRef.current, clientX, clientY)) return false;
    stackRef.current = [...stackRef.current, token];
    setStack(stackRef.current);
    soundEffects.playPop();
    if (stackRef.current.length >= 5) finish();
    return true;
  };

  return (
    <Stage playId="fruit-stack" done={done} className="bg-gradient-to-b from-yellow-200 via-lime-400 to-green-800">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-5">
        <div ref={plateRef} className="min-h-[7rem] min-w-[10rem] flex flex-col-reverse items-center" data-testid="fruit-plate">
          <div className="text-4xl">🍽️</div>
          {stack.map((fruit, i) => (
            <div key={`${fruit}-${i}`} className="text-4xl -mb-2">
              {fruit}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {FRUIT.map((fruit) =>
            stack.includes(fruit) ? (
              <span key={fruit} className="min-h-16 min-w-16 text-5xl opacity-20">
                {fruit}
              </span>
            ) : (
              <button
                key={fruit}
                type="button"
                data-testid={`fruit-${fruit}`}
                className="min-h-16 min-w-16 text-5xl touch-none"
                {...bindFollowDrag(dragging, fruit, fruit, setGhost, drop, () => stackRef.current.includes(fruit))}
              >
                {fruit}
              </button>
            )
          )}
        </div>
      </div>
    </Stage>
  );
}

const STAMPS = [
  { id: "sun", mark: "☀️" },
  { id: "leaf", mark: "🌿" },
  { id: "star", mark: "⭐" },
  { id: "heart", mark: "💗" },
];

function wallLocalPoint(el: HTMLElement | null, clientX: number, clientY: number) {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  if (x < 0 || x > 100 || y < 0 || y > 100) return null;
  return { x, y };
}

function StampMural({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [marks, setMarks] = useState<{ mark: string; x: number; y: number }[]>([]);
  const marksRef = useRef<{ mark: string; x: number; y: number }[]>([]);
  const wallRef = useRef<HTMLDivElement>(null);
  const [toolId, setToolId] = useState(STAMPS[0].id);
  const dragMark = useRef<string | null>(null);
  const [preview, setPreview] = useState<{ mark: string; x: number; y: number } | null>(null);

  const tool = STAMPS.find((stamp) => stamp.id === toolId) ?? STAMPS[0];

  const track = (clientX: number, clientY: number) => {
    const mark = dragMark.current;
    if (!mark) return;
    const point = wallLocalPoint(wallRef.current, clientX, clientY);
    setPreview(point ? { mark, ...point } : null);
  };

  const release = (clientX: number, clientY: number) => {
    const mark = dragMark.current;
    dragMark.current = null;
    setPreview(null);
    if (!mark || marksRef.current.length >= 6) return;
    const point = wallLocalPoint(wallRef.current, clientX, clientY);
    if (!point) {
      soundEffects.playGentleBoing();
      return;
    }
    marksRef.current = [...marksRef.current, { mark, x: point.x, y: point.y }];
    setMarks(marksRef.current);
    soundEffects.playPop();
    if (marksRef.current.length >= 6) finish();
  };

  const begin = (mark: string, event: React.PointerEvent) => {
    if (done || marksRef.current.length >= 6) return;
    dragMark.current = mark;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    track(event.clientX, event.clientY);
  };

  return (
    <Stage playId="stamp-mural" done={done} className="bg-gradient-to-b from-fuchsia-300 via-purple-600 to-indigo-950">
      <div
        ref={wallRef}
        data-testid="mural-wall"
        className="mx-auto mb-4 h-48 w-full max-w-md rounded-3xl bg-amber-50/90 relative overflow-hidden touch-none"
        onPointerDown={(event) => begin(tool.mark, event)}
        onPointerMove={(event) => {
          if (!dragMark.current) return;
          track(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => release(event.clientX, event.clientY)}
        onPointerCancel={() => {
          dragMark.current = null;
          setPreview(null);
        }}
      >
        <span className="sr-only">Stamp the wall</span>
        {marks.map((item, i) => (
          <span
            key={i}
            data-testid={`stamp-print-${i}`}
            className="absolute text-3xl pointer-events-none"
            style={{ top: `${item.y}%`, left: `${item.x}%`, transform: "translate(-50%, -50%)" }}
          >
            {item.mark}
          </span>
        ))}
        {preview && (
          <span
            data-testid="stamp-preview"
            className="absolute text-3xl pointer-events-none opacity-80"
            style={{ top: `${preview.y}%`, left: `${preview.x}%`, transform: "translate(-50%, -50%)" }}
          >
            {preview.mark}
          </span>
        )}
      </div>
      <div className="flex gap-2 justify-center">
        {STAMPS.map((stamp) => (
          <button
            key={stamp.id}
            type="button"
            data-testid={`stamp-${stamp.id}`}
            className={`min-h-16 min-w-16 text-4xl rounded-2xl px-4 py-3 touch-none ${
              toolId === stamp.id ? "bg-white/50 ring-2 ring-white" : "bg-white/20"
            }`}
            onPointerDown={(event) => {
              setToolId(stamp.id);
              begin(stamp.mark, event);
            }}
            onPointerMove={(event) => {
              if (dragMark.current !== stamp.mark) return;
              track(event.clientX, event.clientY);
            }}
            onPointerUp={(event) => release(event.clientX, event.clientY)}
            onPointerCancel={() => {
              dragMark.current = null;
              setPreview(null);
            }}
          >
            {stamp.mark}
          </button>
        ))}
      </div>
    </Stage>
  );
}

const STONES = [
  { id: "once", label: "Once", emoji: "📖", line: "Once upon a time, a den light came on." },
  { id: "then", label: "Then", emoji: "🌙", line: "Then the moon sat down on the pine hill." },
  { id: "end", label: "Path", emoji: "🏡", line: "Little Bear walked the pine path toward home." },
  { id: "friend", label: "Friend", emoji: "🦊", line: "A fox offered a berry without being asked." },
  { id: "gift", label: "Share", emoji: "🍓", line: "They split the berry. Two mouths. One thank-you." },
  { id: "owl", label: "Owl", emoji: "🦉", line: "Owl asked: did you look where you last felt warm?" },
  { id: "blanket", label: "Sea", emoji: "🛏️", line: "The blanket was a small sea that did not have to travel." },
  { id: "sleep", label: "The end", emoji: "⭐", line: "The end. The den kept watch until morning." },
];

function StoryStones({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [step, setStep] = useState(0);
  const spoken = STONES[Math.max(0, step - 1)];
  return (
    <Stage playId="story-stones" done={done} className="bg-gradient-to-b from-orange-200 via-rose-400 to-violet-900">
      <p className="mt-4 px-4 text-center text-lg sm:text-xl font-black text-white drop-shadow-md min-h-14">
        {step === 0 ? "Tap Once to open the tale." : spoken?.line}
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-lg mx-auto">
        {STONES.map((stone, index) => (
          <button
            key={stone.id}
            type="button"
            data-testid={`stone-${stone.id}`}
            className={`flex flex-col items-center rounded-3xl min-h-24 min-w-20 px-3 py-4 ${index < step ? "bg-white text-violet-900" : "bg-white/20 text-white"}`}
            onClick={() => {
              if (index !== step) return;
              soundEffects.playPop();
              speakText(stone.line, { pitch: 1.12 });
              const next = step + 1;
              setStep(next);
              if (next >= STONES.length) finish();
            }}
          >
            <span className="text-4xl sm:text-5xl">{stone.emoji}</span>
            <span className="font-black drop-shadow text-sm">{stone.label}</span>
          </button>
        ))}
      </div>
    </Stage>
  );
}

function NumberPebbles({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [next, setNext] = useState(1);
  return (
    <Stage playId="number-pebbles" done={done} className="bg-gradient-to-b from-teal-200 via-emerald-500 to-lime-900">
      <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-md mx-auto">
        {[7, 3, 1, 9, 5, 2, 10, 4, 8, 6].map((n) => (
          <button
            key={n}
            type="button"
            data-testid={`pebble-${n}`}
            disabled={n < next}
            className={`h-16 w-16 rounded-full text-2xl font-black ${n < next ? "bg-white text-emerald-800" : "bg-stone-700 text-white"}`}
            onClick={() => {
              if (n !== next) {
                soundEffects.playGentleBoing();
                return;
              }
              soundEffects.playPop();
              const after = next + 1;
              setNext(after);
              if (after > 10) finish();
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </Stage>
  );
}

function Campfire({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [logs, setLogs] = useState<number[]>([]);
  const logsRef = useRef<number[]>([]);
  const pitRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);
  const [lit, setLit] = useState(false);

  const drop = (log: DragToken, clientX: number, clientY: number) => {
    const n = Number(log);
    if (logsRef.current.includes(n) || logsRef.current.length >= 4) return true;
    if (!pointerHits(pitRef.current, clientX, clientY, 48)) return false;
    logsRef.current = [...logsRef.current, n];
    setLogs(logsRef.current);
    soundEffects.playPop();
    return true;
  };

  return (
    <Stage playId="campfire" done={done} className="bg-gradient-to-b from-sky-900 via-indigo-950 to-black">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-5 mt-6">
        <div ref={pitRef} className="text-7xl min-h-24 min-w-32 text-center" data-testid="fire-pit">
          {lit ? "🔥" : logs.length ? "🌳".repeat(logs.length) : "⛰️"}
        </div>
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((log) =>
            logs.includes(log) ? (
              <span key={log} className="min-h-16 min-w-16 text-5xl opacity-20">
                🌳
              </span>
            ) : (
              <button
                key={log}
                type="button"
                data-testid={`log-${log}`}
                className="min-h-16 min-w-16 text-5xl touch-none"
                {...bindFollowDrag(dragging, log, "🌳", setGhost, drop, () => logsRef.current.includes(log))}
              >
                🌳
              </button>
            )
          )}
        </div>
        <button
          type="button"
          data-testid="spark"
          className="min-h-14 rounded-full bg-orange-500 px-8 py-4 text-lg font-black text-white"
          onClick={() => {
            if (logs.length < 4) {
              soundEffects.playGentleBoing();
              speakText("Lay four logs first!", { pitch: 1.2 });
              return;
            }
            if (lit) return;
            setLit(true);
            finish();
          }}
        >
          Strike a spark
        </button>
      </div>
    </Stage>
  );
}

const EYES = ["😊", "😮", "😴"];
const MOUTHS = ["😄", "😢", "😌"];

function FeelingFace({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [eyes, setEyes] = useState<string | null>(null);
  const [mouth, setMouth] = useState<string | null>(null);
  useEffect(() => {
    if (eyes && mouth) finish();
  }, [eyes, mouth, finish]);
  return (
    <Stage playId="feeling-face" done={done} className="bg-gradient-to-b from-pink-200 via-rose-400 to-fuchsia-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-32 w-32 rounded-full bg-amber-100 flex items-center justify-center text-6xl" data-testid="face-preview">
          {mouth || eyes || "🙂"}
        </div>
        <p className="text-white font-black">Eyes</p>
        <div className="flex gap-3">
          {EYES.map((eye) => (
            <button key={eye} type="button" data-testid={`eyes-${eye}`} className="min-h-16 min-w-16 text-5xl" onClick={() => setEyes(eye)}>
              {eye}
            </button>
          ))}
        </div>
        <p className="text-white font-black">Mouth</p>
        <div className="flex gap-3">
          {MOUTHS.map((m) => (
            <button key={m} type="button" data-testid={`mouth-${m}`} className="min-h-16 min-w-16 text-5xl" onClick={() => setMouth(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function NightTuck({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [shut, setShut] = useState<number[]>([]);
  const [tucked, setTucked] = useState(false);
  return (
    <Stage playId="night-tuck" done={done} className="bg-gradient-to-b from-indigo-900 via-slate-950 to-black">
      <div className="flex justify-center gap-4 mb-8">
        {[0, 1, 2].map((w) => (
          <button
            key={w}
            type="button"
            data-testid={`shutter-${w}`}
            className="h-32 w-20 rounded-t-2xl border-4 border-amber-200 text-3xl"
            style={{ background: shut.includes(w) ? "#1e1b4b" : "#fde68a" }}
            onClick={() => {
              setShut((prev) => (prev.includes(w) ? prev : [...prev, w]));
              soundEffects.playPop();
            }}
          >
            {shut.includes(w) ? "🌙" : "🏠"}
          </button>
        ))}
      </div>
      <button
        type="button"
        data-testid="teddy"
        className="mx-auto block min-h-20 min-w-20 text-7xl"
        onClick={() => {
          if (shut.length < 3) {
            soundEffects.playGentleBoing();
            speakText("Close the shutters first!", { pitch: 1.2 });
            return;
          }
          if (tucked) return;
          setTucked(true);
          finish();
        }}
      >
        🧸
      </button>
    </Stage>
  );
}

function HoldPlay({
  playId,
  className,
  testId,
  emoji,
  holds = 1,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  testId: string;
  emoji: string;
  holds?: number;
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [fill, setFill] = useState(6);
  const [rounds, setRounds] = useState(0);
  const holding = useRef(false);
  const fillRef = useRef(6);
  const roundsRef = useRef(0);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (!holding.current || done) return;
      fillRef.current = Math.min(100, fillRef.current + 5);
      setFill(fillRef.current);
      if (fillRef.current % 20 < 5) soundEffects.playPop();
      if (fillRef.current >= 100) {
        holding.current = false;
        fillRef.current = 6;
        setFill(6);
        roundsRef.current += 1;
        setRounds(roundsRef.current);
        if (roundsRef.current >= holds) finish();
      }
    }, 70);
    return () => window.clearInterval(tick);
  }, [done, finish, holds]);

  return (
    <Stage playId={playId} done={done} className={className}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="text-7xl sm:text-8xl"
          style={{ transform: playId === "vine-swing" ? `rotate(${fill * 0.7 - 24}deg)` : undefined }}
        >
          {emoji}
        </div>
        <div className="relative h-5 w-56 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuenow={fill}>
          <div className="absolute inset-y-0 left-0 bg-amber-200" style={{ width: `${fill}%` }} />
        </div>
        <button
          type="button"
          data-testid={testId}
          className="min-h-16 min-w-[14rem] rounded-full bg-amber-100 px-10 py-5 text-xl font-black text-amber-950 shadow-lg active:scale-95"
          onPointerDown={() => {
            holding.current = true;
          }}
          onPointerUp={() => {
            holding.current = false;
          }}
          onPointerLeave={() => {
            holding.current = false;
          }}
        >
          {done ? "Done!" : holds > 1 ? `Hold ${Math.min(holds, rounds + 1)} of ${holds}` : "Hold"}
        </button>
      </div>
    </Stage>
  );
}

function ScrubPlay({
  playId,
  className,
  spots,
  tool,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  spots: { id: string; emoji: string; top: string; left: string }[];
  tool: string;
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [got, setGot] = useState<string[]>([]);
  const [toolPos, setToolPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const gotRef = useRef<string[]>([]);

  const collectNear = (clientX: number, clientY: number, stage: HTMLElement) => {
    const box = stage.getBoundingClientRect();
    setToolPos({ x: clientX - box.left, y: clientY - box.top });
    const travelled = origin.current
      ? Math.hypot(clientX - origin.current.x, clientY - origin.current.y)
      : 0;
    if (travelled < 18) return;
    for (const spot of spots) {
      if (gotRef.current.includes(spot.id)) continue;
      const el = stage.querySelector(`[data-testid="spot-${spot.id}"]`);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (Math.hypot(clientX - cx, clientY - cy) > 52) continue;
      gotRef.current = [...gotRef.current, spot.id];
      setGot(gotRef.current);
      soundEffects.playPop();
      if (gotRef.current.length >= spots.length) finish();
    }
  };

  return (
    <Stage playId={playId} done={done} className={className}>
      <div
        className="relative h-72 sm:h-80 touch-none"
        data-testid={`${playId}-scrub`}
        onPointerDown={(event) => {
          dragging.current = true;
          origin.current = { x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture?.(event.pointerId);
          collectNear(event.clientX, event.clientY, event.currentTarget);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          collectNear(event.clientX, event.clientY, event.currentTarget);
        }}
        onPointerUp={() => {
          dragging.current = false;
          origin.current = null;
        }}
      >
        {spots.map((spot) =>
          got.includes(spot.id) ? null : (
            <div
              key={spot.id}
              data-testid={`spot-${spot.id}`}
              className="absolute min-h-16 min-w-16 text-4xl"
              style={{ top: spot.top, left: spot.left }}
            >
              {spot.emoji}
            </div>
          )
        )}
        {toolPos && (
          <div
            className="pointer-events-none absolute text-5xl"
            style={{ left: toolPos.x, top: toolPos.y, transform: "translate(-50%, -50%)" }}
          >
            {tool}
          </div>
        )}
      </div>
      <p className="text-center text-white font-black">
        {got.length} of {spots.length}
      </p>
    </Stage>
  );
}

function BrushTeeth({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [strokes, setStrokes] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef<number | null>(null);
  const travel = useRef(0);
  const strokesRef = useRef(0);

  return (
    <Stage playId="brush-teeth" done={done} className="bg-gradient-to-b from-sky-200 via-cyan-400 to-indigo-800">
      <div
        className="relative mx-auto h-56 w-full max-w-md touch-none rounded-[2rem] bg-rose-100"
        data-testid="brush"
        onPointerDown={(event) => {
          dragging.current = true;
          lastX.current = event.clientX;
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging.current || lastX.current == null) return;
          travel.current += Math.abs(event.clientX - lastX.current);
          lastX.current = event.clientX;
          if (travel.current >= 48 && strokesRef.current < 8) {
            travel.current = 0;
            strokesRef.current += 1;
            setStrokes(strokesRef.current);
            soundEffects.playPop();
            if (strokesRef.current >= 8) finish();
          }
        }}
        onPointerUp={() => {
          dragging.current = false;
          lastX.current = null;
        }}
      >
        <div className="absolute inset-x-8 top-1/2 h-16 -translate-y-1/2 rounded-full bg-white text-center text-5xl leading-[4rem]">
          😁
        </div>
      </div>
      <p className="text-center text-white font-black mt-4">{strokes} of 8 strokes</p>
    </Stage>
  );
}

function DrumBoom({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [step, setStep] = useState(1);
  return (
    <Stage playId="drum-boom" done={done} className="bg-gradient-to-b from-fuchsia-300 via-orange-400 to-rose-800">
      <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-md mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button
            key={n}
            type="button"
            data-testid={`drum-${n}`}
            className={`h-16 w-16 rounded-full text-2xl font-black ${n < step ? "bg-white" : "bg-white/20"}`}
            onClick={() => {
              if (n !== step) {
                soundEffects.playGentleBoing();
                return;
              }
              soundEffects.playPop();
              const next = step + 1;
              setStep(next);
              if (next > 8) finish();
            }}
          >
            🥁{n}
          </button>
        ))}
      </div>
    </Stage>
  );
}

function RocketStars({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [stars, setStars] = useState<number[]>([]);
  const starsRef = useRef<number[]>([]);
  const rocketRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);
  const holding = useRef(false);
  const fillRef = useRef(6);
  const [fill, setFill] = useState(6);

  const drop = (id: DragToken, clientX: number, clientY: number) => {
    const n = Number(id);
    if (starsRef.current.includes(n)) return true;
    if (!pointerHits(rocketRef.current, clientX, clientY, 48)) return false;
    starsRef.current = [...starsRef.current, n];
    setStars(starsRef.current);
    soundEffects.playPop();
    return true;
  };

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (!holding.current || done) return;
      if (starsRef.current.length < 5) return;
      fillRef.current = Math.min(100, fillRef.current + 6);
      setFill(fillRef.current);
      if (fillRef.current >= 100) {
        holding.current = false;
        finish();
      }
    }, 70);
    return () => window.clearInterval(tick);
  }, [done, finish]);

  return (
    <Stage playId="rocket-stars" done={done} className="bg-gradient-to-b from-indigo-900 via-violet-800 to-black">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-5 mt-4">
        <div ref={rocketRef} className="text-7xl min-h-24 min-w-24 text-center" data-testid="rocket">
          {stars.length >= 5 ? "🚀" : "🛰️"}
        </div>
        <p className="text-white font-black">{stars.length} of 5 stars</p>
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((id) =>
            stars.includes(id) ? (
              <span key={id} className="text-4xl opacity-20">⭐</span>
            ) : (
              <button
                key={id}
                type="button"
                data-testid={`star-${id}`}
                className="min-h-14 min-w-14 text-4xl touch-none"
                {...bindFollowDrag(dragging, id, "⭐", setGhost, drop, () => starsRef.current.includes(id))}
              >
                ⭐
              </button>
            )
          )}
        </div>
        <button
          type="button"
          data-testid="launch"
          className="min-h-16 rounded-full bg-orange-500 px-8 py-4 text-xl font-black text-white"
          onPointerDown={() => {
            if (starsRef.current.length < 5) {
              soundEffects.playGentleBoing();
              speakText("Need five stars first!", { pitch: 1.2 });
              return;
            }
            holding.current = true;
          }}
          onPointerUp={() => {
            holding.current = false;
          }}
          onPointerLeave={() => {
            holding.current = false;
          }}
        >
          {done ? "Whoosh!" : fill > 6 ? "Hold to launch" : "Launch"}
        </button>
      </div>
    </Stage>
  );
}
function TenDots({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [filled, setFilled] = useState<number[]>([]);
  const filledRef = useRef<number[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const drop = (counter: DragToken, clientX: number, clientY: number) => {
    const n = Number(counter);
    if (filledRef.current.includes(n) || filledRef.current.length >= 10) return true;
    if (!pointerHits(frameRef.current, clientX, clientY, 48)) return false;
    filledRef.current = [...filledRef.current, n];
    setFilled(filledRef.current);
    soundEffects.playPop();
    if (filledRef.current.length >= 10) finish();
    return true;
  };

  return (
    <Stage playId="ten-dots" done={done} className="bg-gradient-to-b from-lime-200 via-emerald-400 to-teal-800">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-6 mt-4">
        <div ref={frameRef} data-testid="ten-frame" className="grid grid-cols-5 gap-2 rounded-3xl bg-white/20 p-3">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              data-testid={`dot-${i}`}
              className={`h-12 w-12 rounded-xl border-4 ${i < filled.length ? "bg-amber-300 border-white" : "bg-white/10 border-white/50"}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {Array.from({ length: 10 }, (_, i) =>
            filled.includes(i) ? (
              <span key={i} className="h-12 w-12 rounded-full bg-amber-200/20 opacity-20" />
            ) : (
              <button
                key={i}
                type="button"
                data-testid={`counter-${i}`}
                className="h-12 w-12 rounded-full bg-amber-300 border-4 border-white touch-none"
                {...bindFollowDrag(dragging, i, "💛", setGhost, drop, () => filledRef.current.includes(i))}
              />
            )
          )}
        </div>
      </div>
    </Stage>
  );
}

function PuppetBow({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [bow, setBow] = useState<number[]>([]);
  const bowRef = useRef<number[]>([]);
  const startY = useRef<number | null>(null);

  const pull = (i: number, clientY: number) => {
    if (bowRef.current.includes(i) || startY.current == null) return;
    if (clientY - startY.current < 36) return;
    bowRef.current = [...bowRef.current, i];
    setBow(bowRef.current);
    soundEffects.playPop();
    startY.current = null;
    if (bowRef.current.length >= 3) finish();
  };

  return (
    <Stage playId="puppet-bow" done={done} className="bg-gradient-to-b from-rose-200 via-violet-400 to-purple-900">
      <div className="flex justify-center gap-4 mt-10">
        {["🦊", "🐰", "🐻"].map((face, i) => (
          <button
            key={face}
            type="button"
            data-testid={`puppet-${i}`}
            className={`min-h-24 min-w-20 text-6xl rounded-3xl touch-none ${bow.includes(i) ? "bg-white" : "bg-white/20"}`}
            onPointerDown={(event) => {
              startY.current = event.clientY;
              event.currentTarget.setPointerCapture?.(event.pointerId);
            }}
            onPointerMove={(event) => pull(i, event.clientY)}
            onPointerUp={(event) => pull(i, event.clientY)}
          >
            {bow.includes(i) ? "🙇" : face}
          </button>
        ))}
      </div>
    </Stage>
  );
}

function PancakeFlip({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [stacked, setStacked] = useState(0);
  const [phase, setPhase] = useState<"empty" | "pale" | "gold">("empty");

  useEffect(() => {
    if (phase !== "pale") return;
    const t = window.setTimeout(() => setPhase("gold"), 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  const pour = () => {
    if (done || phase !== "empty") return;
    soundEffects.playPop();
    setPhase("pale");
  };

  const flip = () => {
    if (done || phase !== "gold") return;
    soundEffects.playPop();
    const next = stacked + 1;
    setStacked(next);
    setPhase("empty");
    if (next >= 4) finish();
  };

  return (
    <Stage playId="pancake-flip" done={done} className="bg-gradient-to-b from-amber-200 via-orange-400 to-rose-900">
      <div className="flex flex-col items-center gap-5">
        <div className="text-6xl" aria-hidden>
          🔥
        </div>
        <div
          data-testid="pancake-pan"
          className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-stone-800 bg-stone-600 shadow-inner"
        >
          {phase === "empty" ? (
            <span className="text-4xl opacity-40">🍳</span>
          ) : (
            <span
              data-testid="pancake-in-pan"
              className={`text-6xl ${phase === "gold" ? "scale-110" : "opacity-70"}`}
            >
              {phase === "gold" ? "🥞" : "💛"}
            </span>
          )}
        </div>
        <p className="font-black text-amber-50" data-testid="pancake-stack">
          {stacked} of 4 on the plate 🍽️
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            data-testid="pancake-pour"
            className="min-h-16 min-w-[10rem] rounded-full bg-amber-100 px-8 py-5 text-xl font-black text-amber-950 shadow-lg active:scale-95"
            onClick={pour}
          >
            Pour
          </button>
          <button
            type="button"
            data-testid="pancake-flip"
            className="min-h-16 min-w-[10rem] rounded-full bg-rose-100 px-8 py-5 text-xl font-black text-rose-950 shadow-lg active:scale-95"
            onClick={flip}
          >
            Flip
          </button>
        </div>
      </div>
    </Stage>
  );
}


function HangWash({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const bits = [
    { id: "shirt", emoji: "👕" },
    { id: "sock", emoji: "👟" },
    { id: "towel", emoji: "📄" },
    { id: "dress", emoji: "👗" },
  ];
  const [hung, setHung] = useState<string[]>([]);
  const hungRef = useRef<string[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragToken | null>(null);
  const [ghost, setGhost] = useState<{ emoji: string; x: number; y: number } | null>(null);

  const drop = (id: DragToken, clientX: number, clientY: number) => {
    const bitId = String(id);
    if (hungRef.current.includes(bitId)) return true;
    if (!pointerHits(lineRef.current, clientX, clientY, 56)) return false;
    hungRef.current = [...hungRef.current, bitId];
    setHung(hungRef.current);
    soundEffects.playPop();
    if (hungRef.current.length >= bits.length) finish();
    return true;
  };

  return (
    <Stage playId="hang-wash" done={done} className="bg-gradient-to-b from-sky-300 via-lime-300 to-amber-700">
      <DragFollowGhost ghost={ghost} />
      <div className="flex flex-col items-center gap-6">
        <div
          ref={lineRef}
          data-testid="wash-line"
          className="relative w-full max-w-md min-h-24 rounded-full border-4 border-amber-100 bg-white/40 px-4 py-3"
        >
          <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 bg-stone-700" />
          <p className="relative text-center text-4xl min-h-12">
            {hung.map((id) => bits.find((bit) => bit.id === id)?.emoji).join(" ")}
            {hung.length ? " 📌" : "🎀"}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {bits.map((bit) =>
            hung.includes(bit.id) ? (
              <span key={bit.id} className="min-h-16 min-w-16 text-5xl opacity-20">
                {bit.emoji}
              </span>
            ) : (
              <button
                key={bit.id}
                type="button"
                data-testid={`wash-${bit.id}`}
                className="min-h-16 min-w-16 text-5xl touch-none"
                {...bindFollowDrag(dragging, bit.id, bit.emoji, setGhost, drop, () => hungRef.current.includes(bit.id))}
              >
                {bit.emoji}
              </button>
            )
          )}
        </div>
      </div>
    </Stage>
  );
}

const ROOMS: Record<LandPlayId, (props: { onAddStar?: () => void }) => React.JSX.Element> = {
  "milk-cow": MilkCow,
  "firefly-jar": FireflyJar,
  "penguin-slide": PenguinSlide,
  "load-truck": LoadTruck,
  "fire-hose": FireHose,
  "fruit-stack": FruitStack,
  "stamp-mural": StampMural,
  "story-stones": StoryStones,
  "number-pebbles": NumberPebbles,
  campfire: Campfire,
  "feeling-face": FeelingFace,
  "night-tuck": NightTuck,
  "vine-swing": (props) => (
    <HoldPlay playId="vine-swing" className="bg-gradient-to-b from-lime-300 via-emerald-600 to-green-950" emoji="🐒" testId="vine" {...props} />
  ),
  "dew-web": (props) => (
    <ScrubPlay
      playId="dew-web"
      className="bg-gradient-to-b from-emerald-200 via-teal-600 to-slate-900"
      tool="🕸️"
      spots={[
        { id: "a", emoji: "💧", top: "12%", left: "18%" },
        { id: "b", emoji: "💧", top: "20%", left: "62%" },
        { id: "c", emoji: "💧", top: "38%", left: "40%" },
        { id: "d", emoji: "💧", top: "52%", left: "22%" },
        { id: "e", emoji: "💧", top: "58%", left: "70%" },
        { id: "f", emoji: "💧", top: "72%", left: "48%" },
      ]}
      {...props}
    />
  ),
  "seal-clap": (props) => (
    <HoldPlay playId="seal-clap" className="bg-gradient-to-b from-sky-200 via-cyan-500 to-blue-900" emoji="🐬" testId="seal" holds={5} {...props} />
  ),
  "wash-bus": (props) => (
    <ScrubPlay
      playId="wash-bus"
      className="bg-gradient-to-b from-yellow-200 via-orange-400 to-slate-700"
      tool="🛁"
      spots={[
        { id: "a", emoji: "📦", top: "20%", left: "18%" },
        { id: "b", emoji: "📦", top: "28%", left: "55%" },
        { id: "c", emoji: "📦", top: "48%", left: "32%" },
        { id: "d", emoji: "📦", top: "58%", left: "68%" },
        { id: "e", emoji: "📦", top: "70%", left: "44%" },
      ]}
      {...props}
    />
  ),
  "pigeon-feed": (props) => (
    <ScrubPlay
      playId="pigeon-feed"
      className="bg-gradient-to-b from-sky-200 via-lime-300 to-stone-600"
      tool="🍞"
      spots={[
        { id: "a", emoji: "🐦", top: "30%", left: "20%" },
        { id: "b", emoji: "🐦", top: "40%", left: "60%" },
        { id: "c", emoji: "🐦", top: "58%", left: "34%" },
        { id: "d", emoji: "🐦", top: "68%", left: "72%" },
      ]}
      {...props}
    />
  ),
  "knead-dough": (props) => (
    <HoldPlay playId="knead-dough" className="bg-gradient-to-b from-amber-200 via-orange-400 to-rose-900" emoji="🍞" testId="dough" {...props} />
  ),
  "drum-boom": DrumBoom,
  "rocket-stars": RocketStars,
  "ten-dots": TenDots,
  "puddle-jump": (props) => (
    <ScrubPlay
      playId="puddle-jump"
      className="bg-gradient-to-b from-sky-300 via-blue-500 to-emerald-800"
      tool="👢"
      spots={[
        { id: "a", emoji: "💦", top: "28%", left: "16%" },
        { id: "b", emoji: "💦", top: "36%", left: "58%" },
        { id: "c", emoji: "💦", top: "58%", left: "30%" },
        { id: "d", emoji: "💦", top: "70%", left: "66%" },
      ]}
      {...props}
    />
  ),
  "brush-teeth": BrushTeeth,
  "owl-hoot": (props) => (
    <HoldPlay playId="owl-hoot" className="bg-gradient-to-b from-indigo-800 via-slate-900 to-black" emoji="🦉" testId="owl" holds={3} {...props} />
  ),
  "puppet-bow": PuppetBow,
  "syllable-clap": (props) => (
    <HoldPlay playId="syllable-clap" className="bg-gradient-to-b from-yellow-200 via-orange-400 to-rose-800" emoji="👏" testId="clap" holds={3} {...props} />
  ),
  "rain-boots": (props) => (
    <ScrubPlay
      playId="rain-boots"
      className="bg-gradient-to-b from-slate-300 via-sky-500 to-indigo-900"
      tool="👢"
      spots={[
        { id: "a", emoji: "💦", top: "24%", left: "18%" },
        { id: "b", emoji: "💦", top: "34%", left: "62%" },
        { id: "c", emoji: "💦", top: "56%", left: "28%" },
        { id: "d", emoji: "💦", top: "68%", left: "70%" },
      ]}
      {...props}
    />
  ),
  "water-can": (props) => (
    <DragToolSpots playId="water-can" className="bg-gradient-to-b from-lime-200 via-emerald-500 to-green-950" toolTestId="water-can" tool="🚿" spots={[{ id: "a", emoji: "🌱" }, { id: "b", emoji: "🌿" }, { id: "c", emoji: "🌸" }, { id: "d", emoji: "🥬" }]} {...props} />
  ),
  "set-table": (props) => (
    <DragBits playId="set-table" className="bg-gradient-to-b from-amber-100 via-orange-300 to-rose-800" bits={[{ id: "plate", emoji: "🍽️" }, { id: "cup", emoji: "🥤" }, { id: "spoon", emoji: "🥄" }, { id: "napkin", emoji: "📄" }]} targetTestId="table-cloth" targetIdle="👜" {...props} />
  ),
  "pack-bag": (props) => (
    <DragBits playId="pack-bag" className="bg-gradient-to-b from-sky-200 via-blue-400 to-indigo-900" bits={[{ id: "shirt", emoji: "👕" }, { id: "book", emoji: "📘" }, { id: "apple", emoji: "🍎" }, { id: "sock", emoji: "👟" }]} targetTestId="trip-bag" targetIdle="🎒" {...props} />
  ),
  "nest-eggs": (props) => (
    <DragBits playId="nest-eggs" className="bg-gradient-to-b from-lime-200 via-stone-400 to-amber-900" bits={[{ id: "a", emoji: "🥚" }, { id: "b", emoji: "🥚" }, { id: "c", emoji: "🥚" }, { id: "d", emoji: "🥚" }]} targetTestId="dino-nest" targetIdle="🐦" {...props} />
  ),
  "stack-cups": (props) => (
    <DragBits playId="stack-cups" className="bg-gradient-to-b from-violet-200 via-fuchsia-400 to-indigo-900" bits={[{ id: "a", emoji: "🥤" }, { id: "b", emoji: "🥤" }, { id: "c", emoji: "🥤" }, { id: "d", emoji: "🥤" }, { id: "e", emoji: "🥤" }]} targetTestId="cup-tower" targetIdle="⬜" {...props} />
  ),
  "shelf-books": (props) => (
    <DragBits playId="shelf-books" className="bg-gradient-to-b from-amber-200 via-orange-400 to-stone-800" bits={[{ id: "a", emoji: "📕" }, { id: "b", emoji: "📗" }, { id: "c", emoji: "📘" }, { id: "d", emoji: "📙" }]} targetTestId="book-shelf" targetIdle="📚" {...props} />
  ),
  "feed-fish": (props) => (
    <DragToolSpots playId="feed-fish" className="bg-gradient-to-b from-cyan-200 via-blue-500 to-indigo-950" toolTestId="fish-flakes" tool="🍘" spots={[{ id: "a", emoji: "🐠" }, { id: "b", emoji: "🐟" }, { id: "c", emoji: "🐡" }]} {...props} />
  ),
  "hang-stars": (props) => (
    <DragBits playId="hang-stars" className="bg-gradient-to-b from-indigo-400 via-violet-700 to-black" bits={[{ id: "a", emoji: "⭐" }, { id: "b", emoji: "⭐" }, { id: "c", emoji: "⭐" }, { id: "d", emoji: "⭐" }, { id: "e", emoji: "⭐" }]} targetTestId="night-sky" targetIdle="🌃" {...props} />
  ),
  "fish-toss": (props) => (
    <DragBits playId="fish-toss" className="bg-gradient-to-b from-sky-200 via-cyan-400 to-blue-900" bits={[{ id: "a", emoji: "🐟" }, { id: "b", emoji: "🐟" }, { id: "c", emoji: "🐟" }, { id: "d", emoji: "🐟" }]} targetTestId="seal-mouth" targetIdle="🐬" {...props} />
  ),
  "coil-rope": (props) => (
    <DragBits playId="coil-rope" className="bg-gradient-to-b from-amber-200 via-sky-400 to-slate-800" bits={[{ id: "a", emoji: "➰" }, { id: "b", emoji: "➰" }, { id: "c", emoji: "➰" }, { id: "d", emoji: "➰" }]} targetTestId="bollard" targetIdle="⚓" {...props} />
  ),
  "bag-market": (props) => (
    <DragBits playId="bag-market" className="bg-gradient-to-b from-yellow-200 via-orange-400 to-rose-800" bits={[{ id: "carrot", emoji: "🥕" }, { id: "bread", emoji: "🍞" }, { id: "cheese", emoji: "🧀" }, { id: "pear", emoji: "🍐" }]} targetTestId="market-bag" targetIdle="🛍️" {...props} />
  ),
  "scoop-moon": (props) => (
    <DragBits playId="scoop-moon" className="bg-gradient-to-b from-indigo-300 via-slate-700 to-black" bits={[{ id: "a", emoji: "✨" }, { id: "b", emoji: "✨" }, { id: "c", emoji: "✨" }, { id: "d", emoji: "✨" }]} targetTestId="moon-tin" targetIdle="🥫" {...props} />
  ),
  "pancake-flip": PancakeFlip,
  "hang-wash": HangWash,
};

export function ToddlerLandRooms({
  playId,
  onAddStar,
}: {
  playId: LandPlayId;
  onAddStar?: () => void;
}) {
  const Room = ROOMS[playId];
  if (!Room) {
    return (
      <div className="rounded-[2rem] border-4 border-amber-300/50 bg-slate-950/70 p-6 text-center">
        <p className="text-xl font-black text-white">This room is being painted.</p>
        <p className="mt-2 text-sm font-semibold text-white/80">Pick another Play on the trail.</p>
      </div>
    );
  }
  return <Room onAddStar={onAddStar} />;
}
