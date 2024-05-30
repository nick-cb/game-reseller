import * as Q from './queries';

export async function getAllCollections() {
  try {
    const { data } = await Q.getAllCollections();
    return buildArrayCollectionResponse({ collections: data });
  } catch (error) {
    console.error('Error in GameService.getAllCollections', error);
    return buildArrayCollectionResponse({ collections: [], error });
  }
}

type BuildSingleCollectionResponseParams = {
  collection: Partial<Collections>;
  game_list: Game[];
  error?: unknown;
};
function buildSingleCollectionResponse(params: BuildSingleCollectionResponseParams) {
  const { collection, game_list, error } = params;

  return {
    data: {
      ID: collection.ID ?? -1,
      name: collection.name ?? '--',
      collection_key: collection.collection_key ?? '--',
      game_list: game_list ?? [],
    },
    error: error instanceof Error ? error : null,
  };
}

type BuildArrayCollectionResponseParams = {
  collections: Partial<Collections>[];
  error?: unknown;
};
function buildArrayCollectionResponse(params: BuildArrayCollectionResponseParams) {
  const { collections, error } = params;

  return {
    data: collections.map((collection) => {
      const { data } = buildSingleCollectionResponse({ collection, game_list: [] });
      return data;
    }),
    error: error instanceof Error ? error : null,
  };
}
