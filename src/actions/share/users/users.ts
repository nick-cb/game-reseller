'use server';

import { Users } from '@/database/models/model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as Q from './queries';
import ShareActions from '..';
import { uuidv4 } from '@/utils';
import { bucket } from '@/firebase';
import { cookies } from 'next/headers';

export async function createUser(params: Q.CreateUserParams) {
  try {
    const { email, password } = params;
    const existUser = await ShareActions.users.getUserByEmail(email);
    if (existUser.data.ID !== -1) {
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const { data } = await Q.createUser({ ...params, password: encryptedPassword });

    const file = await generateAvatarForUser({ user: { ID: data.insertId } });
    const url = file.publicUrl();
    await ShareActions.users.updateUserByID(data.insertId, { user: { avatar: url } });

    return buildSingleResponse({ data: { ID: data.insertId } });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type GenerateAvatarForUserParams = {
  user: { ID: number };
};
async function generateAvatarForUser(params: GenerateAvatarForUserParams) {
  const { user } = params;
  const response = await fetch('https://api.dicebear.com/7.x/lorelei/svg?seed=' + uuidv4());
  const arrayBuffer = await response.arrayBuffer();
  const fileName = user.ID + uuidv4() + 'avatar.svg';
  const file = bucket.file(fileName);
  // @ts-ignore
  file.save(new Uint8Array(arrayBuffer), async () => {
    await file.makePublic();
  });
  return file;
}

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
    const { data } = await Q.getUserByID(ID);
    return buildSingleResponse({ data: data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

export async function getUserByEmail(email: string) {
  try {
    const { data } = await Q.getUserByEmail(email);
    return buildSingleResponse({ data: data });
  } catch (error) {
    return buildSingleResponse({ error });
  }
}

type GenerateTokenParams = {
  ID: number;
};
export async function generateToken(params: GenerateTokenParams) {
  const { ID } = params;
  const payload = { user: { ID } };
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: eval(process.env.SESSION_EXPIRY!),
    });
  }
  throw new Error('No JWT_SECRET found');
}

type DecodeTokenParams = {
  token: string;
};
export async function decodeToken(params: DecodeTokenParams) {
  const { token } = params;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Not found JWT_SECRET');
  }
  const payload = await jwt.verify(token, secret);
  if (typeof payload !== 'string') {
    return payload as jwt.JwtPayload & { user: { ID: number } };
  }
  return payload;
}

export async function getUserInfoInCookie() {
  const cookie = cookies().get('refresh_token');
  if (!cookie) {
    return null;
  }
  const payload = await decodeToken({ token: cookie.value });
  if (typeof payload === 'string') {
    return null;
  }
  return payload as jwt.JwtPayload & { user: { ID: number } };
}

export async function checkLoginStatus() {
  const cookie = cookies().get('refresh_token');
  if (!cookie) {
    return false;
  }

  const verifiedToken = jwt.verify(cookie.value, process.env.JWT_SECRET!);
  if (typeof verifiedToken === 'string') {
    return false;
  }

  return true;
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
      stripe_id: data?.stripe_id ?? '',
    },
    error: error instanceof Error ? { message: error.message } : null,
  };
}
