import "server-only";

import { sql } from '@/database';

export const groupImageByType = (type: string | string[], colors = false) => {
  const colorQuery = colors
    ? sql`json_object(
            'highestSat', gi.colors -> '$.highestSat',
            'palette', gi.colors -> '$.palette'
      )`
    : sql`json_object('highestSat', json_array(), 'palette', json_array())`;

  const query = sql`
  select coalesce(
    json_arrayagg(
       json_object(
           'ID', gi.ID,
           'url', gi.url,
           'type', gi.type,
           'alt', gi.alt,
           'row', gi.pos_row,
           'colors', ${colorQuery}
       )
    ), json_array())
  from game_images gi
  where gi.game_id = g.ID
    and gi.type in (${type})
  group by type
`;

  return query;
};
