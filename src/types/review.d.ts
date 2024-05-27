type CriticAvg = 'weak' | 'fair' | 'strong' | 'mighty';

type Polls = {
  ID: number;
  text: string | null;
  emoji: string | null;
  result_emoji: string | null;
  result_title: string;
  result_text: string | null;
  game_id: number;
};

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
