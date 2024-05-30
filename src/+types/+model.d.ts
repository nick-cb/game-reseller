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

type GameImages = {
  ID: number;
  url: string;
  type: string;
  alt: string;
  game_id: number;
  row: number;
  colors: { palette: number[][]; highestSat: number[] };
};

type Videos = {
  ID: number;
  thumbnail: string;
  game_id: number;
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

type Collections = {
  ID: number;
  name: string;
  collection_key: string;
};

type CollectionDetail = {
  ID: number;
  game_id: number;
  collection_id: number;
};

type Polls = {
  ID: number;
  text: string | null;
  emoji: string | null;
  result_emoji: string | null;
  result_title: string;
  result_text: string | null;
  game_id: number;
};

type CriticAvg = 'weak' | 'fair' | 'strong' | 'mighty';

type Reviews = {
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
  avg_rating: number;
};

type Requirements = {
  ID: number;
  audio: string | null;
  text: string | null;
  game_id: number;
};

type SystemDetails = {
  ID: number;
  title: string;
  minimum: string | null;
  recommended: string | null;
  system_id: number;
};

type Systems = {
  ID: number;
  os: string | null;
  game_id: number;
};

type Tags = {
  ID: number;
  name: string;
  tag_key: string;
  group_name: string | null;
};

type TagDetails = {
  ID: number;
  game_id: number;
  tag_id: number;
};

type Users = {
  ID: number;
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  refresh_token: string | null;
  avatar: string;
  stripe_id: string | null;
};

type Carts = {
  ID: number;
  user_id: number;
};

type CartDetails = {
  ID: number;
  cart_id: number;
  game_id: number;
};

type Orders = {
  ID: number;
  payment_intent?: string;
  amount: number;
  payment_method: string;
  payment_service: 'stripe' | 'paypal';
  created_at: string;
  items: string;
  card_number?: string;
  card_type?: string;
  user_id: number;
  succeeded_at?: string;
  canceled_at?: string;
  status:
    | 'canceled'
    | 'processing'
    | 'requires_capture'
    | 'requires_confirmation'
    | 'requires_payment_method'
    | 'succeeded'
    | 'pending';
};
