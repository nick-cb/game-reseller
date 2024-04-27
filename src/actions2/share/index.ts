export * from './tags/tags';
import * as tags from './tags/tags';
export * from './collections/collections';
import * as collections from './collections/collections';
export * from './users/users';
import * as users from './users/users';
export * from './payments/payments';
import * as payments from './payments/payments';
export * from './orders/orders';
import * as orders from './orders/orders';
export * from './carts/carts';
import * as carts from './carts/carts';
export * from './games/games';
import * as games from './games/games';

const ShareActions = {
  tags,
  collections,
  users,
  payments,
  orders,
  carts,
  games,
};

export default ShareActions;
