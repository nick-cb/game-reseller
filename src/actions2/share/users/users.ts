'use server';

import { Users } from '@/database/models/model';
import * as Q from './queries';

export async function updateUserByID(ID: number, params: Q.UpdateUserByIDParams) {
  try {
    const { data } = await Q.updateUserByID(ID, params);
    return buildSingleResponse({ data: data as any });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

export async function getUserByID(ID: number) {
  try {
  } catch (error) {}
}

export async function getUserByEmail(email: string) {
  try {
    const { data } = await Q.getUserByEmail(email);
    return buildSingleResponse({ data: data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type BuildSingleResponseParams = {
  data?: Partial<Users>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { data, error } = params;
  return {
    data: {
      ID: data?.ID ?? -1,
      full_name: data?.full_name ?? '',
      display_name: data?.display_name ?? '',
      email: data?.email ?? '',
      avatar: data?.avatar ?? '',
      refresh_token: data?.refresh_token ?? '',
      password: data?.password ?? '',
    },
    error: error instanceof Error ? error.message : error,
  };
}
