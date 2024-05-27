// Game
type Game = {
  ID: number;
  name: string;
  description: string | null;
  long_description: string | null;
  developer: string;
  publisher: string;
  release_date: string;
  sale_price: number;
  purchase_count: number;
  offer_id: string;
  slug: string;
  avg_rating: number | null;
  audio: string | null;
  text: string | null;
  critic_avg: number | null;
  critic_rec: string | null;
  critic_pct: number | null;
} & (
  | { type: 'base_game'; base_game_id: null; base_game_slug: null }
  | { type: 'add_on' | 'dlc'; base_game_id: number; base_game_slug: string }
);

type GameWithImages = Game & { images: GameImageGroup };

// Others
type Tags = {
  ID: number;
  name: string;
  tag_key: string;
  group_name: string | null;
};
