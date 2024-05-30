'use server';

import { insertSingle, querySingle, sql, updateSingle } from '@/database';
import { isUndefined } from '@/utils';

export type CreateUserParams = {
  full_name: string | null;
  display_name: string | null;
  email: string;
  password: string;
  avatar: string | null;
};
export async function createUser(params: CreateUserParams) {
  const { full_name, display_name, email, password, avatar } = params;
  return insertSingle(sql`
    insert into users (full_name, display_name, email, password, avatar)
    values (${full_name}, ${display_name}, ${email}, ${password}, ${avatar});
  `);
}

export type UpdateUserByIDParams = {
  user: Partial<Users>;
};
export async function updateUserByID(ID: number, params: UpdateUserByIDParams) {
  const { user } = params;
  const { email, avatar, password, full_name, stripe_id, display_name, refresh_token } = user;
  return updateSingle(sql`
    update users
    set 
      full_name = if(${!isUndefined(full_name)}, ${full_name}, full_name),
      display_name = if(${isUndefined(display_name)}, ${display_name}, display_name),
      email = if(${!isUndefined(email)}, ${email}, email),
      avatar = if(${!isUndefined(avatar)}, ${avatar}, avatar),
      password = if(${!isUndefined(password)}, ${password}, password),
      stripe_id = if(${!isUndefined(stripe_id)}, ${stripe_id}, stripe_id),
      refresh_token = if(${!isUndefined(refresh_token)}, ${refresh_token}, refresh_token)
    where ID = ${ID}
  `);
}

export async function getUserByID(ID: number) {
  return await querySingle<Users>(sql`
    select * from users where ID = ${ID}
  `);
}

export async function getUserByEmail(email: string) {
  return await querySingle<Users>(sql`
    select * from users where email = ${email}
  `);
}
