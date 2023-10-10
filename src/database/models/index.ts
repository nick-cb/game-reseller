export type Game = {
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
  | { type: "base_game"; base_game_id: null }
  | { type: "add_on" | "dlc"; base_game_id: number }
);
export type CriticAvg = "weak" | "fair" | "strong" | "mighty";

export type GameImageGroup = {
  portrait: GameImages;
  landscape: GameImages;
  logo: GameImages;
};

export type GameImages = {
  ID: number;
  url: string;
  type: string;
  alt: string;
  game_id: number;
  row: number;
};

export type Polls = {
  ID: number;
  text: string | null;
  emoji: string | null;
  result_emoji: string | null;
  result_title: string;
  result_text: string | null;
  game_id: number;
};

export default interface Reviews {
  ID: number;
  author: string;
  body: string | null;
  outlet: string;
  earned_score: number | null;
  total_score: number | null;
  type: string;
  game_id: number;
  text: string | null;
  url: string | null;
}

export type Requirements = {
  ID: number;
  audio: string | null;
  text: string | null;
  game_id: number;
};

export type SystemDetails = {
  ID: number;
  title: string;
  minimum: string | null;
  recommended: string | null;
  system_id: number;
};

export type Systems = {
  ID: number;
  os: string | null;
  game_id: number;
};

export type TagDetails = {
  ID: number;
  game_id: number;
  tag_id: number;
};

export type Tags = {
  ID: number;
  name: string;
  tag_key: string;
  group_name: string | null;
};

export type VideoRecipes = {
  recipe: string | null;
  manifest: string;
  media_ref_id: string | null;
  video_id: number;
  ID: number;
};

export type VideoVariants = {
  ID: number;
  url: string;
  width: number | null;
  height: number | null;
  media_key: string;
  content_type: string;
  recipe_id: number;
  duration: number | null;
};

export type Videos = {
  ID: number;
  thumbnail: string;
  game_id: number;
};

export type Collections = {
  ID: number;
  name: string;
  collection_key: string;
};

export type CollectionDetail = {
  ID: number;
  game_id: number;
  collection_id: number;
};

export type Users = {
  ID: number;
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  refresh_token: string | null;
  avatar: string;
  stripe_id: string | null;
};

type OrderItem = Pick<
  Game,
  | "ID"
  | "name"
  | "type"
  | "developer"
  | "publisher"
  | "sale_price"
  | "slug"
  | "base_game_id"
> & {
  images: Pick<GameImageGroup, "portrait">;
} & {
  discounts: any[];
  discount_price: number;
};

export type Orders = Omit<CreateOrderPayload, "ID" | "items"> & {
  items: OrderItem[];
};

export type CreateOrderPayload = {
  payment_intent: string | null;
  amount: number;
  payment_method: string;
  payment_service: "stripe" | "paypal";
  created_at: string;
  items: string;
  card_number: string | null;
  card_type: string | null;
  user_id: number;
  succeeded_at: string | null;
  canceled_at: string | null;
  status: "pending" | "succeeded" | "canceled_at";
};
