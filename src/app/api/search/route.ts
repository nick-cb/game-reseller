import { query, sql } from '@/database';
import { Game, GameImageGroup } from '@/database/models/model';
import { NextResponse } from 'next/server';
import { groupImageByType } from '@/actions2/share/images';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const { data } = await query<
    (Game & {
      images: GameImageGroup;
    })[]
  >(sql`
      select *,
             json_object('portraits', (${groupImageByType('portrait')})) as images
      from games g
      where name like ${'%' + keyword + '%'}
      limit 10;
  `);

  return NextResponse.json({ data: data });
}
