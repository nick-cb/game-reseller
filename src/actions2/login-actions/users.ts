'use server';

import { Users } from '@/database/models/model';
import ShareActions from '../share';

type LoginParams = {
  email: string;
  password: string;
};
export async function login(params: LoginParams) {
  try {
    const { email } = params;
    const { data } = await ShareActions.users.getUserByEmail(email);
    if (data.ID === -1) {
      return buildSingleResponse({ error: new Error('User not found') });
    }
  } catch (error) {}
}

type BuildSingleResponseParams = {
  data?: Partial<Users>;
  error: unknown;
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
    },
    error: error instanceof Error ? error : null,
  };
}
