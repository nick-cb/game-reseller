type OrderItem = Pick<
  Game,
  'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug' | 'base_game_id'
> & {
  images: Pick<GameImageGroup, 'portraits'>;
} & {
  discounts: any[];
  discount_price: number;
};
