import { RowDataPacket } from 'mysql2';
import Reviews, {
  Videos,
  VideoRecipes,
  VideoVariants,
  Game,
  GameImages,
  Polls,
  SystemDetails,
  Systems,
  Tags,
} from './database/models/model';

export type OmitGameId<T extends { game_id: number }> = Omit<T, 'game_id'>;
export type OmitVideoId<T extends { video_id: number }> = Omit<T, 'video_id'>;
export type OmitRecipeId<T extends { recipe_id: number }> = Omit<T, 'recipe_id'>;
export type OmitSystemId<T extends { system_id: number }> = Omit<T, 'system_id'>;

export type FBySlug = RowDataPacket &
  Game & {
    images: OmitGameId<GameImages>[];
    videos: OmitGameId<FVideoFullInfo>[];
    systems: OmitGameId<
      Systems & {
        details: OmitSystemId<SystemDetails>[];
      }
    >[];
    tags: Tags[];
    reviews: OmitGameId<Reviews>[];
    polls: OmitGameId<Polls>[];
  };

export type FVideoFullInfo = Videos & {
  recipes: (OmitVideoId<VideoRecipes> & {
    variants: OmitRecipeId<VideoVariants>[];
  })[];
};

type FMappingById = Game & {
  images: OmitGameId<GameImages>[];
};

type GGameByTags = RowDataPacket &
  Game & {
    images: OmitGameId<GameImages>[];
  };
