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

type FindSystemDetailsResult = Array<
  Systems & {
    details: Array<SystemDetails>;
  }
>;

type TagDetails = {
  ID: number;
  game_id: number;
  tag_id: number;
};
