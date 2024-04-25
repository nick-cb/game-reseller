'use server';

import { sql, updateSingle } from '@/database';
import { Users } from '@/database/models/model';
import { isUndefined } from '@/utils';

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
