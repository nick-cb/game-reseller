import { query, sql } from '@/database';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data } = await query<
    (Game & {
      images: GameImages[];
    })[]
  >(sql`
      select *
      from games
               join (select game_id,
                            json_arrayagg(json_object('ID', ID, 'type', type, 'url', url, 'pos_row', pos_row, 'alt',
                                                      alt)) as images
                     from game_images
                     group by game_id) gi on games.ID = gi.game_id
      limit 25;
  `);

  return NextResponse.json({
    data: data,
  });
}
