type CartFull = Carts & {
  game_list: (Pick<
    Game,
    'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug'
  > & { images: GameImages[]; checked: boolean })[];
};
