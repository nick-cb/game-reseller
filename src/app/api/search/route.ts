import { groupImageByType } from '@/+actions/+share/queries/images';
import { query, sql } from '@/db/query-helper';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  if (!keyword) {
    return NextResponse.json({ data: [] });
  }
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
