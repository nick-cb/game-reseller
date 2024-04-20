'use server';

import { query, sql } from '@/database';

type GetTagListParams = {
  groupName: string;
};
export async function getTagListByGroupName(params: GetTagListParams) {
  const { groupName } = params;

  return query(sql`
    select * from tags where group_name = ${groupName}
  `);
}
