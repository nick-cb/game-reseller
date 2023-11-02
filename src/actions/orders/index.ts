"use server";

import { sql, updateSingle } from "@/database";
import { Orders } from "@/database/models";
import { isUndefined } from "@/utils";

export async function updateOrder(
  id: number,
  {
    order,
  }: {
    order: Partial<Omit<Orders, "ID">>;
  },
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
    payment_intent,
    payment_method,
    payment_service,
  } = order;

  // prettier-ignore
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

export async function updateOrderByPaymentIntent(
  id: string,
  {
    order,
  }: {
    order: Partial<Omit<Orders, "ID">>;
  },
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
    payment_intent,
    payment_method,
    payment_service,
  } = order;

  // prettier-ignore
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
    where payment_intent = ${id}
  `);
}
