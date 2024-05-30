'use server';

import * as Q from './queries';

type GetTagListParams = {
  groupName: string;
};
export async function getTagListByGroupName(params: GetTagListParams) {
  try {
    const { data } = await Q.getTagListByGroupName(params);
    return buildArrayResponse({ tags: data });
  } catch (error) {
    console.error('getTagListByGroupName', error);
    return buildArrayResponse({ tags: [], error });
  }
}

type BuildSingleResponseParams = {
  tag: Partial<Tags>;
  error?: unknown;
};
function buildSingleResponse(params: BuildSingleResponseParams) {
  const { tag, error } = params;

  return {
    data: {
      ID: tag.ID ?? -1,
      name: tag.name ?? '',
      tag_key: tag.tag_key ?? '',
      group_name: tag.group_name ?? '',
    },
    error: error instanceof Error ? error : null,
  };
}

type BuildArrayResponseParams = {
  tags: Partial<Tags>[];
  error?: unknown;
};
function buildArrayResponse(params: BuildArrayResponseParams) {
  const { tags, error } = params;

  return {
    data: tags.map((tag) => {
      const { data } = buildSingleResponse({ tag });
      return data;
    }),
    error: error instanceof Error ? error : null,
  };
}
