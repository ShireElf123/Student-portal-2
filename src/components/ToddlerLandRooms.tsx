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
  | "rain-boots";

const COPY: Record<LandPlayId, { title: string; line: string; done: string }> = {
  "milk-cow": { title: "Milk the cow", line: "Hold the pail. Fill it to the top.", done: "Warm milk for the barn!" },
  "firefly-jar": { title: "Catch fireflies", line: "Tap six glow-bugs into the jar.", done: "A lantern of tiny stars!" },
  "penguin-slide": { title: "Penguin slide", line: "Slide the penguin down to the fish hole.", done: "Splash! A fish for lunch!" },
  "load-truck": { title: "Load the truck", line: "Tap four crates onto the truck.", done: "All loaded. Ready to roll!" },
  "fire-hose": { title: "Hang the hoses", line: "Tap each flame to put the water on it.", done: "The fire house is calm." },
  "fruit-stack": { title: "Stack the stall", line: "Tap fruit onto the plate. Fill five.", done: "A market tower!" },
  "stamp-mural": { title: "Stamp a mural", line: "Pick a stamp. Press the wall six times.", done: "A wall full of colour!" },
  "story-stones": { title: "Story stones", line: "Tap the stones in story order.", done: "Once upon a time… you told it!" },
  "number-pebbles": { title: "Number pebbles", line: "Tap the pebbles from 1 to 5.", done: "The meadow counted with you!" },
  campfire: { title: "Build a campfire", line: "Lay four logs, then strike a spark.", done: "Warm light on the trail." },
  "feeling-face": { title: "Make a feeling", line: "Pick eyes, then a mouth.", done: "That face has a feeling!" },
  "night-tuck": { title: "Tuck in for night", line: "Close three shutters, then hug teddy.", done: "Quiet house. Sweet sleep." },
  "vine-swing": { title: "Swing the vine", line: "Tap the vine. Swing five times.", done: "Wheee across the canopy!" },
  "dew-web": { title: "Dew on the web", line: "Tap six shiny drops.", done: "The web sparkles." },
  "seal-clap": { title: "Seal clap", line: "Tap the seal five times.", done: "Clap clap clap!" },
  "wash-bus": { title: "Wash the bus", line: "Tap the dirt spots off.", done: "Shiny bus. Beep beep!" },
  "pigeon-feed": { title: "Feed the pigeons", line: "Tap four crumbs to the birds.", done: "Coo! Full tummies." },
  "knead-dough": { title: "Knead the dough", line: "Press the dough eight times.", done: "Soft bread ready." },
  "drum-boom": { title: "Boom the drums", line: "Tap the drums 1, then 2, then 3.", done: "A parade beat!" },
  "rocket-stars": { title: "Star the rocket", line: "Tap five stars, then launch.", done: "Whoosh to the moon!" },
  "ten-dots": { title: "Fill the ten-frame", line: "Tap ten dots. Fill every box.", done: "Ten. A full frame!" },
  "puddle-jump": { title: "Puddle jump", line: "Tap four puddles. Splash!", done: "Wet boots. Big grin." },
  "brush-teeth": { title: "Brush, brush", line: "Brush eight strokes.", done: "Clean shiny teeth." },
  "owl-hoot": { title: "Owl hoot", line: "Tap the owl three times.", done: "Hoo hoo hoo." },
  "puppet-bow": { title: "Puppet bow", line: "Tap each puppet to take a bow.", done: "The nook claps!" },
  "syllable-clap": { title: "Clap ba-na-na", line: "Clap three beats.", done: "Ba. Na. Na!" },
  "rain-boots": { title: "Rain boots", line: "Stamp four puddles.", done: "Splash all the way home." },
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
  "milk-cow": ["☁️", "🏡", "🌾", "🌻", "🪵"],
  "firefly-jar": ["🌙", "🌸", "🌿", "⭐", "🍃"],
  "penguin-slide": ["❄️", "🧊", "🌨️", "🐟", "🏔️"],
  "load-truck": ["🛢️", "🧰", "🛞", "🚧", "📦"],
  "fire-hose": ["🚒", "🔔", "🪜", "💧", "🧯"],
  "fruit-stack": ["🧺", "🍋", "🍉", "🥕", "🌽"],
  "stamp-mural": ["🎨", "🖌️", "🌈", "✨", "🖼️"],
  "story-stones": ["📖", "🌙", "🏡", "⭐", "🌲"],
  "number-pebbles": ["🌼", "🍃", "🦋", "🪨", "☀️"],
  campfire: ["🌲", "🦉", "🌙", "⭐", "🏕️"],
  "feeling-face": ["💗", "🌼", "🌈", "🧸", "☀️"],
  "night-tuck": ["🌙", "⭐", "🦉", "🛏️", "🕯️"],
  "vine-swing": ["🌴", "🦜", "🍃", "🍌", "☀️"],
  "dew-web": ["🕸️", "💧", "🌿", "🪲", "🌸"],
  "seal-clap": ["🦭", "❄️", "🧊", "🌊", "🐟"],
  "wash-bus": ["🚌", "🧽", "💧", "☀️", "🛞"],
  "pigeon-feed": ["🕊️", "🍞", "🌳", "🪑", "🌤️"],
  "knead-dough": ["🍞", "🌾", "🥣", "🔥", "🧈"],
  "drum-boom": ["🥁", "🎵", "🌈", "🎺", "⭐"],
  "rocket-stars": ["🚀", "🌙", "⭐", "🪐", "✨"],
  "ten-dots": ["🔟", "🌼", "📗", "⭐", "🔷"],
  "puddle-jump": ["🌧️", "🌈", "🌲", "💧", "☔"],
  "brush-teeth": ["🪥", "😁", "💧", "🌙", "⭐"],
  "owl-hoot": ["🦉", "🌙", "🌲", "⭐", "🪵"],
  "puppet-bow": ["🎭", "🎪", "🌟", "🧵", "👏"],
  "syllable-clap": ["👏", "🐟", "🔤", "💧", "🌙"],
  "rain-boots": ["👢", "🌧️", "🪟", "☕", "☂️"],
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
  const copy = COPY[playId];
  useEffect(() => {
    const t = setTimeout(() => speakText(copy.line, { pitch: 1.2, rate: 0.92 }), 180);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [copy.line]);
  useEffect(() => {
    if (done) speakText(copy.done, { pitch: 1.22 });
  }, [done, copy.done]);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border-4 border-white/25 min-h-[28rem] sm:min-h-[32rem] p-4 sm:p-6 ${className}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {SCENERY[playId].map((bit, index) => (
          <span
            key={`${bit}-${index}`}
            className="absolute text-3xl sm:text-4xl opacity-80"
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
            🫙
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

function LoadTruck({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [loaded, setLoaded] = useState<number[]>([]);
  const crates = [0, 1, 2, 3];
  return (
    <Stage playId="load-truck" done={done} className="bg-gradient-to-b from-amber-200 via-orange-400 to-stone-800">
      <div className="flex flex-col items-center gap-6">
        <div className="text-7xl" data-testid="truck-bed">
          🚚
          <span className="text-2xl align-top">{loaded.map(() => "📦").join("")}</span>
        </div>
        <div className="flex gap-3">
          {crates.map((crate) => (
            <button
              key={crate}
              type="button"
              data-testid={`crate-${crate}`}
              disabled={loaded.includes(crate)}
              className="min-h-16 min-w-16 text-5xl disabled:opacity-20"
              onClick={() => {
                setLoaded((prev) => {
                  if (prev.includes(crate)) return prev;
                  const next = [...prev, crate];
                  soundEffects.playPop();
                  if (next.length >= 4) finish();
                  return next;
                });
              }}
            >
              📦
            </button>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function FireHose({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [hose, setHose] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  return (
    <Stage playId="fire-hose" done={done} className="bg-gradient-to-b from-rose-400 via-red-700 to-slate-900">
      <button
        type="button"
        data-testid="hose"
        className={`mx-auto mb-4 block min-h-16 rounded-full px-8 py-4 text-xl font-black ${hose ? "bg-sky-200 text-sky-950" : "bg-white text-rose-900"}`}
        onClick={() => {
          setHose(true);
          soundEffects.playPop();
        }}
      >
        {hose ? "Hose ready" : "Grab the hose"}
      </button>
      <div className="flex justify-around items-end h-56">
        {[0, 1, 2].map((flame) => (
          <button
            key={flame}
            type="button"
            data-testid={`flame-${flame}`}
            className="min-h-20 min-w-20 text-6xl"
            onClick={() => {
              if (!hose) {
                soundEffects.playGentleBoing();
                speakText("Grab the hose first!", { pitch: 1.2 });
                return;
              }
              setOut((prev) => {
                if (prev.includes(flame)) return prev;
                const next = [...prev, flame];
                soundEffects.playPop();
                if (next.length >= 3) finish();
                return next;
              });
            }}
          >
            {out.includes(flame) ? "💧" : "🔥"}
          </button>
        ))}
      </div>
      <p className="text-center text-white/80 font-black mt-4">{hose ? "Tap the flames" : "Grab the hose, then tap the flames"}</p>
    </Stage>
  );
}

const FRUIT = ["🍎", "🍊", "🍌", "🍇", "🍐"];

function FruitStack({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [stack, setStack] = useState<string[]>([]);
  return (
    <Stage playId="fruit-stack" done={done} className="bg-gradient-to-b from-yellow-200 via-lime-400 to-green-800">
      <div className="flex flex-col items-center gap-5">
        <div className="min-h-[7rem] flex flex-col-reverse items-center" data-testid="fruit-plate">
          <div className="text-4xl">🍽️</div>
          {stack.map((fruit, i) => (
            <div key={`${fruit}-${i}`} className="text-4xl -mb-2">
              {fruit}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          {FRUIT.map((fruit) => (
            <button
              key={fruit}
              type="button"
              data-testid={`fruit-${fruit}`}
              className="min-h-16 min-w-16 text-5xl"
              onClick={() => {
                setStack((prev) => {
                  if (prev.length >= 5) return prev;
                  const next = [...prev, fruit];
                  soundEffects.playPop();
                  if (next.length >= 5) finish();
                  return next;
                });
              }}
            >
              {fruit}
            </button>
          ))}
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

function StampMural({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [tool, setTool] = useState(STAMPS[0].mark);
  const [marks, setMarks] = useState<string[]>([]);
  return (
    <Stage playId="stamp-mural" done={done} className="bg-gradient-to-b from-fuchsia-300 via-purple-600 to-indigo-950">
      <div className="flex gap-2 justify-center mb-3">
        {STAMPS.map((stamp) => (
          <button
            key={stamp.id}
            type="button"
            data-testid={`stamp-${stamp.id}`}
            className={`min-h-16 min-w-16 text-4xl rounded-2xl px-4 py-3 ${tool === stamp.mark ? "bg-white" : "bg-white/20"}`}
            onClick={() => setTool(stamp.mark)}
          >
            {stamp.mark}
          </button>
        ))}
      </div>
      <button
        type="button"
        data-testid="mural-wall"
        className="mx-auto block h-48 w-full max-w-md rounded-3xl bg-amber-50/90 relative overflow-hidden"
        onClick={() => {
          setMarks((prev) => {
            if (prev.length >= 6) return prev;
            const next = [...prev, tool];
            soundEffects.playPop();
            if (next.length >= 6) finish();
            return next;
          });
        }}
      >
        <span className="sr-only">Stamp the wall</span>
        {marks.map((mark, i) => (
          <span key={i} className="absolute text-2xl" style={{ top: `${12 + (i % 3) * 28}%`, left: `${10 + i * 12}%` }}>
            {mark}
          </span>
        ))}
      </button>
    </Stage>
  );
}

const STONES = [
  { id: "once", label: "Once", emoji: "🪨" },
  { id: "then", label: "Then", emoji: "🌙" },
  { id: "end", label: "The end", emoji: "🏡" },
];

function StoryStones({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [step, setStep] = useState(0);
  return (
    <Stage playId="story-stones" done={done} className="bg-gradient-to-b from-orange-200 via-rose-400 to-violet-900">
      <div className="flex justify-center gap-4 mt-8">
        {STONES.map((stone, index) => (
          <button
            key={stone.id}
            type="button"
            data-testid={`stone-${stone.id}`}
            className={`flex flex-col items-center rounded-3xl px-4 py-5 ${index < step ? "bg-white" : "bg-white/20"}`}
            onClick={() => {
              if (index !== step) return;
              soundEffects.playPop();
              const next = step + 1;
              setStep(next);
              if (next >= 3) finish();
            }}
          >
            <span className="text-5xl">{stone.emoji}</span>
            <span className="font-black text-white drop-shadow">{stone.label}</span>
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
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {[3, 1, 5, 2, 4].map((n) => (
          <button
            key={n}
            type="button"
            data-testid={`pebble-${n}`}
            disabled={n < next}
            className={`h-20 w-20 rounded-full text-3xl font-black ${n < next ? "bg-white text-emerald-800" : "bg-stone-700 text-white"}`}
            onClick={() => {
              if (n !== next) {
                soundEffects.playGentleBoing();
                return;
              }
              soundEffects.playPop();
              const after = next + 1;
              setNext(after);
              if (after > 5) finish();
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
  const [logs, setLogs] = useState(0);
  const [lit, setLit] = useState(false);
  return (
    <Stage playId="campfire" done={done} className="bg-gradient-to-b from-sky-900 via-indigo-950 to-black">
      <div className="flex flex-col items-center gap-5 mt-6">
        <div className="text-7xl" data-testid="fire-pit">
          {lit ? "🔥" : logs ? "🪵".repeat(Math.min(logs, 4)) : "🪨"}
        </div>
        <button
          type="button"
          data-testid="add-log"
          className="min-h-14 rounded-full bg-amber-200 px-8 py-4 text-lg font-black text-amber-950"
          onClick={() => {
            setLogs((n) => {
              const next = Math.min(4, n + 1);
              soundEffects.playPop();
              return next;
            });
          }}
        >
          Lay a log
        </button>
        <button
          type="button"
          data-testid="spark"
          className="min-h-14 rounded-full bg-orange-500 px-8 py-4 text-lg font-black text-white"
          onClick={() => {
            if (logs < 4) {
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
            {shut.includes(w) ? "🌙" : "🪟"}
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

function TapCount({
  playId,
  className,
  need,
  emoji,
  testId,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  need: number;
  emoji: string;
  testId: string;
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [n, setN] = useState(0);
  return (
    <Stage playId={playId} done={done} className={className}>
      <button
        type="button"
        data-testid={testId}
        className="mx-auto block min-h-24 min-w-24 text-7xl"
        onClick={() => {
          setN((value) => {
            const next = Math.min(need, value + 1);
            soundEffects.playPop();
            if (next >= need) finish();
            return next;
          });
        }}
      >
        {emoji}
      </button>
      <p className="text-center text-white font-black mt-4" data-testid={`${testId}-count`}>
        {n} of {need}
      </p>
    </Stage>
  );
}

function SpotTap({
  playId,
  className,
  spots,
  onAddStar,
}: {
  playId: LandPlayId;
  className: string;
  spots: { id: string; emoji: string; top: string; left: string }[];
  onAddStar?: () => void;
}) {
  const { done, finish } = useCredit(onAddStar);
  const [got, setGot] = useState<string[]>([]);
  return (
    <Stage playId={playId} done={done} className={className}>
      <div className="relative h-72 sm:h-80">
        {spots.map((spot) =>
          got.includes(spot.id) ? null : (
            <button
              key={spot.id}
              type="button"
              data-testid={`spot-${spot.id}`}
              className="absolute min-h-16 min-w-16 text-4xl"
              style={{ top: spot.top, left: spot.left }}
              onClick={() => {
                setGot((prev) => {
                  if (prev.includes(spot.id)) return prev;
                  const next = [...prev, spot.id];
                  soundEffects.playPop();
                  if (next.length >= spots.length) finish();
                  return next;
                });
              }}
            >
              {spot.emoji}
            </button>
          )
        )}
      </div>
      <p className="text-center text-white font-black">{got.length} of {spots.length}</p>
    </Stage>
  );
}

function DrumBoom({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [step, setStep] = useState(1);
  return (
    <Stage playId="drum-boom" done={done} className="bg-gradient-to-b from-fuchsia-300 via-orange-400 to-rose-800">
      <div className="flex justify-center gap-4 mt-8">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            data-testid={`drum-${n}`}
            className={`min-h-24 min-w-24 rounded-full text-5xl font-black ${n < step ? "bg-white" : "bg-white/20"}`}
            onClick={() => {
              if (n !== step) {
                soundEffects.playGentleBoing();
                return;
              }
              soundEffects.playPop();
              const next = step + 1;
              setStep(next);
              if (next > 3) finish();
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
  const [stars, setStars] = useState(0);
  return (
    <Stage playId="rocket-stars" done={done} className="bg-gradient-to-b from-indigo-900 via-violet-800 to-black">
      <div className="flex flex-col items-center gap-5 mt-6">
        <div className="text-7xl">{stars >= 5 ? "🚀" : "🛰️"}</div>
        <button
          type="button"
          data-testid="star-tap"
          className="min-h-16 rounded-full bg-amber-200 px-8 py-4 text-xl font-black text-amber-950"
          onClick={() => {
            setStars((n) => Math.min(5, n + 1));
            soundEffects.playPop();
          }}
        >
          Tap a star
        </button>
        <p className="text-white font-black">{stars} of 5</p>
        <button
          type="button"
          data-testid="launch"
          className="min-h-16 rounded-full bg-orange-500 px-8 py-4 text-xl font-black text-white"
          onClick={() => {
            if (stars < 5) {
              soundEffects.playGentleBoing();
              speakText("Need five stars first!", { pitch: 1.2 });
              return;
            }
            finish();
          }}
        >
          Launch
        </button>
      </div>
    </Stage>
  );
}

function TenDots({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [on, setOn] = useState<number[]>([]);
  return (
    <Stage playId="ten-dots" done={done} className="bg-gradient-to-b from-lime-200 via-emerald-400 to-teal-800">
      <div className="grid grid-cols-5 gap-3 max-w-sm mx-auto mt-6">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            type="button"
            data-testid={`dot-${i}`}
            className={`h-14 w-14 rounded-xl border-4 ${on.includes(i) ? "bg-amber-300 border-white" : "bg-white/20 border-white/50"}`}
            onClick={() => {
              setOn((prev) => {
                if (prev.includes(i)) return prev;
                const next = [...prev, i];
                soundEffects.playPop();
                if (next.length >= 10) finish();
                return next;
              });
            }}
          />
        ))}
      </div>
    </Stage>
  );
}

function PuppetBow({ onAddStar }: { onAddStar?: () => void }) {
  const { done, finish } = useCredit(onAddStar);
  const [bow, setBow] = useState<number[]>([]);
  return (
    <Stage playId="puppet-bow" done={done} className="bg-gradient-to-b from-rose-200 via-violet-400 to-purple-900">
      <div className="flex justify-center gap-4 mt-10">
        {["🦊", "🐰", "🐻"].map((face, i) => (
          <button
            key={face}
            type="button"
            data-testid={`puppet-${i}`}
            className={`min-h-24 min-w-20 text-6xl rounded-3xl ${bow.includes(i) ? "bg-white" : "bg-white/20"}`}
            onClick={() => {
              setBow((prev) => {
                if (prev.includes(i)) return prev;
                const next = [...prev, i];
                soundEffects.playPop();
                if (next.length >= 3) finish();
                return next;
              });
            }}
          >
            {bow.includes(i) ? "🙇" : face}
          </button>
        ))}
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
    <TapCount playId="vine-swing" className="bg-gradient-to-b from-lime-300 via-emerald-600 to-green-950" need={5} emoji="🐒" testId="vine" {...props} />
  ),
  "dew-web": (props) => (
    <SpotTap
      playId="dew-web"
      className="bg-gradient-to-b from-emerald-200 via-teal-600 to-slate-900"
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
    <TapCount playId="seal-clap" className="bg-gradient-to-b from-sky-200 via-cyan-500 to-blue-900" need={5} emoji="🦭" testId="seal" {...props} />
  ),
  "wash-bus": (props) => (
    <SpotTap
      playId="wash-bus"
      className="bg-gradient-to-b from-yellow-200 via-orange-400 to-slate-700"
      spots={[
        { id: "a", emoji: "🟫", top: "20%", left: "18%" },
        { id: "b", emoji: "🟫", top: "28%", left: "55%" },
        { id: "c", emoji: "🟫", top: "48%", left: "32%" },
        { id: "d", emoji: "🟫", top: "58%", left: "68%" },
        { id: "e", emoji: "🟫", top: "70%", left: "44%" },
      ]}
      {...props}
    />
  ),
  "pigeon-feed": (props) => (
    <SpotTap
      playId="pigeon-feed"
      className="bg-gradient-to-b from-sky-200 via-lime-300 to-stone-600"
      spots={[
        { id: "a", emoji: "🍞", top: "30%", left: "20%" },
        { id: "b", emoji: "🍞", top: "40%", left: "60%" },
        { id: "c", emoji: "🍞", top: "58%", left: "34%" },
        { id: "d", emoji: "🍞", top: "68%", left: "72%" },
      ]}
      {...props}
    />
  ),
  "knead-dough": (props) => (
    <TapCount playId="knead-dough" className="bg-gradient-to-b from-amber-200 via-orange-400 to-rose-900" need={8} emoji="🍞" testId="dough" {...props} />
  ),
  "drum-boom": DrumBoom,
  "rocket-stars": RocketStars,
  "ten-dots": TenDots,
  "puddle-jump": (props) => (
    <SpotTap
      playId="puddle-jump"
      className="bg-gradient-to-b from-sky-300 via-blue-500 to-emerald-800"
      spots={[
        { id: "a", emoji: "💦", top: "28%", left: "16%" },
        { id: "b", emoji: "💦", top: "36%", left: "58%" },
        { id: "c", emoji: "💦", top: "58%", left: "30%" },
        { id: "d", emoji: "💦", top: "70%", left: "66%" },
      ]}
      {...props}
    />
  ),
  "brush-teeth": (props) => (
    <TapCount playId="brush-teeth" className="bg-gradient-to-b from-sky-200 via-cyan-400 to-indigo-800" need={8} emoji="😁" testId="brush" {...props} />
  ),
  "owl-hoot": (props) => (
    <TapCount playId="owl-hoot" className="bg-gradient-to-b from-indigo-800 via-slate-900 to-black" need={3} emoji="🦉" testId="owl" {...props} />
  ),
  "puppet-bow": PuppetBow,
  "syllable-clap": (props) => (
    <TapCount playId="syllable-clap" className="bg-gradient-to-b from-yellow-200 via-orange-400 to-rose-800" need={3} emoji="👏" testId="clap" {...props} />
  ),
  "rain-boots": (props) => (
    <SpotTap
      playId="rain-boots"
      className="bg-gradient-to-b from-slate-300 via-sky-500 to-indigo-900"
      spots={[
        { id: "a", emoji: "👢", top: "24%", left: "18%" },
        { id: "b", emoji: "👢", top: "34%", left: "62%" },
        { id: "c", emoji: "👢", top: "56%", left: "28%" },
        { id: "d", emoji: "👢", top: "68%", left: "70%" },
      ]}
      {...props}
    />
  ),
};

export function ToddlerLandRooms({
  playId,
  onAddStar,
}: {
  playId: LandPlayId;
  onAddStar?: () => void;
}) {
  const Room = ROOMS[playId];
  return <Room onAddStar={onAddStar} />;
}
