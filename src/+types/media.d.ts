type FindVideoArrayResult = Array<
  Videos & {
    recipes: Array<
      VideoRecipes & {
        variants: Array<VideoVariants>;
      }
    >;
  }
>;

type FindVideoItemResult = Videos & {
  recipes: Array<
    VideoRecipes & {
      variants: Array<VideoVariants>;
    }
  >;
};
