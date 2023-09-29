import { connectDB, sql } from "@/database";
import { Game, GameImages } from "@/database/models";
import { OmitGameId } from "@/database/repository/game/select";
import { groupImages } from "@/utils/data";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const db = await connectDB();
  const response = await db.execute<
    (RowDataPacket &
      Game & {
        images: OmitGameId<GameImages>[];
      })[]
  >(sql`
      select *
      from games
               join (select game_id,
                            json_arrayagg(json_object('ID', ID, 'type', type, 'url', url, 'pos_row', pos_row, 'alt',
                                                      alt)) as images
                     from game_images
                     group by game_id) gi on games.ID = gi.game_id
      where name like '%${keyword}%'
      limit 10;
  `);

  return NextResponse.json({
    data: response[0].map((game) => {
      return {
        ...game,
        images: groupImages(game.images),
      };
    }),
  });
}
