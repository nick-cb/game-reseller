import { decodeToken, findUserById } from '@/actions/users';
import { PaymentTabButton, SpriteIcon, SavePayment } from '@/components/payment/PaymentRadioTab';
import { StripeCheckoutForm, StripeElementsNullish } from '@/components/payment/Stripe';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { stripe } from '@/utils';
import { deleteCart } from '@/actions/cart';
import { Game, GameImageGroup, Orders } from '@/database/models';
import { Accordion, AccordionBody, AccordionGroup, AccordionHeader } from '@/components/Accordion';
import { MobileGameList } from '@/components/checkout/MobileGameList';
import { PaymentItem } from '@/components/checkout/SavedCardItem';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { SnackContextProvider } from '@/components/SnackContext';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { PlaceOrderButton } from '../game/PlaceOrderButton';
import {
  IntersectionObserverContainer,
  IntersectionObserverRoot,
} from '../intersection/IntersectionObserver';
import { ScrollItem } from '../scroll2/ScrollPrimitive';
import { getPaymentMethod, placeOrder } from './actions';

type PayWithStripeParams = {
  paymentMethod: string;
  save: boolean;
};
export type CheckoutViewProps = {
  gameList: (Pick<
    Game,
    'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug'
  > & {
    checked: boolean;
    images: GameImageGroup;
  })[];
  cartId?: number;
};
export async function CheckoutView(props: CheckoutViewProps) {
  const { gameList, cartId } = props;
  const cookie = cookies().get('refresh_token');
  if (!cookie) {
    return redirect('/');
  }
  const payload = await decodeToken(cookie.value);
  if (typeof payload === 'string') {
    return redirect('/');
  }
  const { data: user } = await findUserById({ id: payload.userId });
  if (!user) {
    return redirect('/');
  }

  const paymentMethodRes = user.stripe_id
    ? await stripe.customers.listPaymentMethods(user.stripe_id, { type: 'card' })
    : null;
  const paymentMethods = paymentMethodRes?.data || [];
  const userHasPaymentMethods = !!paymentMethods.length;

  let amount = 0;
  for (const game of gameList.filter((game) => game.checked)) {
    amount += parseFloat(game.sale_price.toString());
  }

  const payWithStripe = async ({ paymentMethod, save }: PayWithStripeParams) => {
    'use server';
    try {
      if (!paymentMethod) {
        return { error: 'Please provide a valid payment method' };
      }
      const { id, card, customer } = await getPaymentMethod({
        user,
        paymentMethod,
        paymentMethods,
      });
      const { brand, last4 } = card || {};
      const paymentIntent = await stripe.paymentIntents.create({
        confirm: true,
        amount: amount,
        currency: 'vnd',
        customer: customer as string,
        payment_method: id,
        use_stripe_sdk: true,
        ...(save ? { setup_future_usage: 'off_session' } : {}),
      });
      const newOrder = {
        payment_intent: paymentIntent!.id,
        created_at: dayjs(paymentIntent?.created).format('YYYY-MM-DD HH:mm:ss'),
        card_type: brand || undefined,
        card_number: last4 || undefined,
        amount: amount,
        status: ['canceled', 'succeeded'].includes(paymentIntent.status)
          ? (paymentIntent.status as Orders['status'])
          : 'pending',
      };
      const orderId = await placeOrder({ userId: user.ID, order: newOrder, gameList });
      if (cartId) {
        await deleteCart(cartId);
      }

      return {
        orderId,
        clientSecret: paymentIntent.client_secret!,
        status: paymentIntent.status,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : '' };
    }
  };

  return (
    <SnackContextProvider>
      <StripeElementsNullish amount={amount} currency={'vnd'}>
        <CheckoutForm
          payWithStripe={payWithStripe}
          className={'flex grid-cols-[calc(70%-32px)_30%] flex-col gap-8 md:grid'}
          style={{ gridTemplateRows: `repeat(${4 + paymentMethods.length},min-content)` }}
        >
          <MobileGameList gameList={gameList} />
          <AccordionGroup exclusive defaultValue={paymentMethods.length > 0 ? 0 : 1}>
            {userHasPaymentMethods ? (
              <div
                className="col-start-1 col-end-2"
                style={{ gridRow: `1 / span ${paymentMethods.length}` }}
              >
                <Accordion index={0}>
                  <AccordionHeader className="h-max rounded-t border-b border-white_primary/25 bg-paper px-3 py-4">
                    Your payment methods
                  </AccordionHeader>
                  <AccordionBody remountChild className="rounded-b bg-paper px-3 pb-4">
                    <ul className="flex flex-col gap-2 ">
                      {paymentMethods.map((payment) => {
                        return <PaymentItem key={payment.id} payment={payment} />;
                      })}
                    </ul>
                  </AccordionBody>
                </Accordion>
              </div>
            ) : null}
            <Accordion index={1}>
              <div
                className="col-start-1 h-max rounded bg-paper"
                style={{ gridRow: `${paymentMethods.length + 1} / -1` }}
              >
                {userHasPaymentMethods ? (
                  <AccordionHeader className="h-max rounded-t border-b border-white_primary/25 bg-paper px-3 py-4">
                    Other payment methods
                  </AccordionHeader>
                ) : (
                  <h3 className="mb-4 text-xl uppercase">Payment methods</h3>
                )}
                <AccordionBody remountChild className="rounded-b bg-paper px-3 py-4 pb-4">
                  <IntersectionObserverContainer>
                    <ul className={'flex gap-4 3/4sm:gap-8 ' + ' snap-x snap-mandatory '}>
                      <PaymentTabButton method="stripe" index={0}>
                        <SpriteIcon stroke="white" fill="white" sprite={'actions'} id={'card'} />
                        Card
                      </PaymentTabButton>
                      <PaymentTabButton method="paypal" index={1}>
                        <SpriteIcon fill="none" stroke="white" sprite={'actions'} id={'paypal'} />
                        Paypal
                      </PaymentTabButton>
                    </ul>
                    <br />
                    <IntersectionObserverRoot>
                      <ul
                        className={
                          'flex h-full w-[calc(100%+16px)] -translate-x-2 gap-8 rounded px-2 ' +
                          ' scrollbar-hidden overflow-y-hidden overflow-x-scroll ' +
                          ' snap-x snap-mandatory '
                        }
                      >
                        <ScrollItem className={'stripe-card w-full shrink-0 snap-center'}>
                          <StripeCheckoutForm amount={amount} />
                          <hr className="my-2 border-default" />
                          <SavePayment id="card" />
                        </ScrollItem>
                        <ScrollItem className="w-full shrink-0 snap-center">
                          <p className="text-[14.88px]">
                            You will be directed to PayPal to authorize your payment method, then
                            you will be returned to Penguin Games to complete this purchase.
                          </p>
                          <hr className="my-4 border-default" />
                          <SavePayment id="paypal" />
                        </ScrollItem>
                      </ul>
                    </IntersectionObserverRoot>
                  </IntersectionObserverContainer>
                </AccordionBody>
              </div>
            </Accordion>
          </AccordionGroup>
          <div id="checkout-button" className={'md:col-start-2'}>
            <PlaceOrderButton>Place order</PlaceOrderButton>
          </div>
          <div
            className="col-start-2 row-start-1 hidden md:block"
            style={{ gridRow: `1 / span ${1 + paymentMethods.length}` }}
          >
            <OrderSummary totalAmount={amount} gameList={gameList} />
          </div>
        </CheckoutForm>
      </StripeElementsNullish>
    </SnackContextProvider>
  );
}
