'use server';

import { Users } from '@/database/models/model';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import ShareActions from '../share';
import { COOKIES_OPTIONS } from '@/utils/config';

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
    const matchPass = await bcrypt.compare(params.password, data.password);
    if (!matchPass) {
      return buildSingleResponse({ error: new Error('Invalid password') });
    }

    const token = await ShareActions.users.generateToken({ ID: data.ID });
    await ShareActions.users.updateUserByID(data.ID, { user: { refresh_token: token } });
    cookies().set('refresh_token', token, COOKIES_OPTIONS);

    return buildSingleResponse({ data });
  } catch (error) {
    console.log({ error });
    return buildSingleResponse({ error });
  }
}

type SignupParams = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  confirm_password: string;
  avatar: string | null;
};
export async function signup(params: SignupParams) {
  try {
    const { data, error } = await ShareActions.users.createUser(params);
    if (error) {
      return buildSingleResponse({ error });
    }
    const token = await ShareActions.users.generateToken({ ID: data.ID });
    await ShareActions.users.updateUserByID(data.ID, { user: { refresh_token: token } });
    cookies().set('refresh_token', token, COOKIES_OPTIONS);

    return buildSingleResponse({ data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

export async function logout() {
  try {
    const cookie = cookies().get('refresh_token');
    if (!cookie) {
      return;
    }
    const payload = await ShareActions.users.decodeToken({ token: cookie.value });
    if (typeof payload === 'string') {
      return;
    }
    await ShareActions.users.updateUserByID(payload.userId, {
      user: { refresh_token: null },
    });
    cookies().delete('refresh_token');
    return buildSingleResponse({ data: {} });
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
    },
    error: error instanceof Error ? { message: error.message } : null,
  };
}
