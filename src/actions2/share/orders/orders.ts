'use server';

import { Game, OrderItem, Orders } from '@/database/models/model';
import * as Q from './queries';

type CreateOrderParams = {
  order: {
    payment_intent?: string;
    amount: number;
    payment_method: string;
    payment_service: 'stripe' | 'paypal';
    items: Pick<Game, 'ID' | 'name' | 'type' | 'developer' | 'publisher' | 'sale_price' | 'slug'>[];
    card_number?: string;
    card_type?: string;
    user_id: number;
    status: 'canceled' | 'processing' | 'succeeded';
  };
};
export async function createOrder(params: CreateOrderParams) {
  try {
    const { order } = params;
    const payment_intent = order.payment_intent ?? null;
    const amount = order.amount;
    const payment_method = order.payment_method;
    const payment_service = order.payment_service;
    const items = order.items;
    const card_number = order.card_number ?? null;
    const card_type = order.card_type ?? null;
    const user_id = order.user_id;
    const succeeded_at = order.status === 'succeeded' ? Date.now() : null;
    const canceled_at = order.status === 'canceled' ? Date.now() : null;
    const status = order.status;
    const created_at = Date.now();

    const { data } = await Q.createOrder({
      order: {
        payment_intent,
        amount,
        payment_method,
        payment_service,
        items: JSON.stringify(items),
        card_number,
        card_type,
        user_id,
        status,
        succeeded_at,
        canceled_at,
        created_at,
      },
    });
    const { insertId } = data;

    return buildSingleResponse({ data: { ID: insertId } as any });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type UpdateOrderByIDParams = {
  order: Partial<Omit<Orders, 'ID'>>;
}
export async function updateOrderByID(ID: number, params: UpdateOrderByIDParams) {
  try {
    return Q.updateOrderByID(ID, params);
  } catch (error) {

  }
}

export async function findOrderByID(ID: number) {
  try {
    const { data } = await Q.findOrderByID(ID);
    return buildSingleResponse({ data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type BuildSingleResponseParams = {
  data?: Partial<Orders | Omit<Orders, 'items'> & {items: string}>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { data, error } = params ?? {};
  return {
    data: {
      ID: data?.ID ?? -1,
      payment_intent: data?.payment_intent ?? null,
      amount: data?.amount ?? -1,
      payment_method: data?.payment_method ?? '',
      payment_service: data?.payment_service ?? '',
      items: typeof data?.items === 'string' ? JSON.parse(data.items) as OrderItem[] : (data?.items ?? []),
      card_number: data?.card_number ?? '',
      card_type: data?.card_type ?? '',
      user_id: data?.user_id ?? -1,
      status: data?.status ?? 'processing',
      succeeded_at: data?.succeeded_at ?? null,
      canceled_at: data?.canceled_at ?? null,
      created_at: data?.created_at ?? -1,
    },
    error: error instanceof Error ? error.message : error,
  };
}
