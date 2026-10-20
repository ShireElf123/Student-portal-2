/** Painted island covers and toy stills. Missing files fall back to gradient. */
export const WORLD_COVER: Record<string, string> = {
  "animal-world": "/worlds/animal-world.jpg",
  "bug-world": "/worlds/bug-world.jpg",
  "arctic-world": "/worlds/arctic-world.jpg",
  "vehicle-world": "/worlds/vehicle-world.jpg",
  "city-world": "/worlds/city-world.jpg",
  "kitchen-world": "/worlds/kitchen-world.jpg",
  "creative-world": "/worlds/creative-world.jpg",
  "story-world": "/worlds/story-world.jpg",
  "learning-world": "/worlds/learning-world.jpg",
  "adventure-world": "/worlds/adventure-world.jpg",
  "my-world": "/worlds/my-world.jpg",
  "night-world": "/worlds/night-world.jpg",
};

export const SECRET_COVER: Record<string, string> = {
  "zone-dino-cave": "/worlds/secret-dino-cave.jpg",
  "zone-starlight-observatory": "/worlds/secret-starlight.jpg",
  "zone-coral-cavern": "/worlds/secret-coral.jpg",
};

export const TOY_STILL: Record<string, string> = {
  stir: "/toys/stir.jpg",
  drive: "/toys/drive.jpg",
  pour: "/toys/pour.jpg",
  trace: "/toys/trace.jpg",
  scoop: "/toys/scoop.jpg",
  pet: "/toys/pet.jpg",
  plant: "/toys/plant.jpg",
  comb: "/toys/comb.jpg",
};

/** Cartoon Pip for bouncing chrome. Painted portraits stay unused in play UI. */
export const CAST = {
  pip: "/cast/pip.jpg",
  nana: "/cast/nana.jpg",
  pipCartoon: "/cast/pip-cartoon.jpg",
} as const;

export const UI_CHROME = {
  cloud: "/ui/cloud.jpg",
  sun: "/ui/sun.jpg",
} as const;
