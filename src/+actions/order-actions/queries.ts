'use server';

import { insertSingle, querySingle, sql, updateSingle } from '@/db/query-helper';
import { isUndefined } from '@/utils';

export type CreateOrderParams = {
  order: {
    payment_intent: string | null;
    amount: number;
    payment_method: string;
    payment_service: 'stripe' | 'paypal';
    created_at: number;
    items: string;
    card_number: string | null;
    card_type: string | null;
    user_id: number;
    succeeded_at: number | null;
    canceled_at: number | null;
    status: 'canceled' | 'processing' | 'succeeded';
  };
};
export async function createOrder(params: CreateOrderParams) {
  const { order } = params;
  return insertSingle(sql`
    insert into orders (payment_intent, amount, payment_method, payment_service, 
                        created_at, items, status, succeeded_at,
                        canceled_at, card_number, card_type, user_id)
    values (${order.payment_intent}, ${order.amount}, ${order.payment_method}, 
            ${order.payment_service}, ${order.canceled_at}, ${order.items}, 
            ${order.status}, ${order.succeeded_at}, ${order.canceled_at}, 
            ${order.card_number}, ${order.card_type}, ${order.user_id}
           )
  `);
}

type UpdateOrderByIDParams = {
  order: Partial<Omit<Orders, 'ID'>>;
};
export async function updateOrderByID(id: number, params: UpdateOrderByIDParams) {
  const {
    items,
    amount,
    status,
    user_id,
    card_type,
    created_at,
    canceled_at,
    card_number,
    succeeded_at,
    payment_intent,
    payment_method,
    payment_service,
  } = params.order;

  return updateSingle(sql`
    update orders
      set 
        items = if(${!isUndefined(items)}, ${JSON.stringify(items)}, items),
        amount = if(${!isUndefined(amount)}, ${amount}, amount),
        status = if(${!isUndefined(status)}, ${status}, status),
        user_id = if(${!isUndefined(user_id)}, ${user_id}, user_id),
        card_type = if(${!isUndefined(card_type)}, ${card_type}, card_type),
        created_at = if(${!isUndefined(created_at)}, ${created_at}, created_at),
        canceled_at = if(${!isUndefined(canceled_at)}, ${canceled_at}, canceled_at),
        card_number = if(${!isUndefined(card_number)}, ${card_number}, card_number),
        succeeded_at = if(${!isUndefined(succeeded_at)}, ${succeeded_at}, succeeded_at),
        payment_intent = if(${!isUndefined(payment_intent)}, ${payment_intent}, payment_intent),
        payment_method = if(${!isUndefined(payment_method)}, ${payment_method}, payment_method),
        payment_service = if(${!isUndefined(payment_service)}, ${payment_service}, payment_service)
    where ID = ${id}
  `);
}

export type UpdateOrderByPaymentIntentParams = UpdateOrderByIDParams;
export async function updateOrderByPaymentIntent(
  payment_intent: string,
  params: UpdateOrderByPaymentIntentParams
) {
  const {
    items,
    amount,
    status,
    user_id,
    card_type,
    created_at,
    canceled_at,
    card_number,
    succeeded_at,
    payment_method,
    payment_service,
  } = params.order;

  return updateSingle(sql`
    update orders
      set 
        items = if(${!isUndefined(items)}, ${JSON.stringify(items)}, items),
        amount = if(${!isUndefined(amount)}, ${amount}, amount),
        status = if(${!isUndefined(status)}, ${status}, status),
        user_id = if(${!isUndefined(user_id)}, ${user_id}, user_id),
        card_type = if(${!isUndefined(card_type)}, ${card_type}, card_type),
        created_at = if(${!isUndefined(created_at)}, ${created_at}, created_at),
        canceled_at = if(${!isUndefined(canceled_at)}, ${canceled_at}, canceled_at),
        card_number = if(${!isUndefined(card_number)}, ${card_number}, card_number),
        succeeded_at = if(${!isUndefined(succeeded_at)}, ${succeeded_at}, succeeded_at),
        payment_intent = if(${!isUndefined(payment_intent)}, ${payment_intent}, payment_intent),
        payment_method = if(${!isUndefined(payment_method)}, ${payment_method}, payment_method),
        payment_service = if(${!isUndefined(payment_service)}, ${payment_service}, payment_service)
    where payment_intent = ${payment_intent}
  `);
}

export async function findOrderByID(ID: number) {
  return querySingle<Omit<Orders, 'items'> & { items: string }>(sql`
    select * from orders where id = ${ID};
  `);
}
