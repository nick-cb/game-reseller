type GameImages = {
  ID: number;
  url: string;
  type: string;
  alt: string;
  game_id: number;
  row: number;
  colors: { palette: number[][]; highestSat: number[] };
};

type GameImageGroup = {
  portraits: GameImages[];
  landscapes: GameImages[];
  logos: GameImages[];
};

type VideoRecipes = {
  recipe: string | null;
  manifest: string;
  media_ref_id: string | null;
  video_id: number;
  ID: number;
};

type VideoVariants = {
  ID: number;
  url: string;
  width: number | null;
  height: number | null;
  media_key: 'low' | 'medium' | 'high' | 'audio';
  content_type: string;
  recipe_id: number;
  duration: number;
};

type Videos = {
  ID: number;
  thumbnail: string;
  game_id: number;
};

type FindVideoResult = Videos & {
  recipes: Array<VideoRecipes & { variants: Array<VideoVariants> }>;
};

type Prettify<T> = {
  [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
} & {};
