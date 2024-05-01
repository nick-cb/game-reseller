export * from './cartpage/cartspage';
import * as cartPage from './cartpage/cartspage';
export * from './carts';
import * as carts from './carts';

const CartActions = {
  carts: carts,
  cartPage: cartPage,
}

export default CartActions;
