interface QueryWithKeywords {
  /** Limit selection to comma-separated keywords. */
  keywords?: string;
}

interface QueryWithPhotoId {
  /** Get a specific Photo by its ID. */
  photoId: string;
}

interface QueryWithCollectionId extends QueryWithKeywords {
  /** Public collection ID to filter selection. */
  collectionId: string;
}

interface QueryWithTopicId extends QueryWithKeywords {
  /** Public topic ID to filter selection. */
  topicId: string;
}

interface QueryWithUsername extends QueryWithKeywords {
  /** Limit selection to a single user. */
  username: string;
}

type AuthorizedQuery = {
  /** Your Unsplash application's access key to authorize the query. */
  accessKey: string;

  /** Public collection ID(‘s) to filter selection. */
  collectionIds?: string[] | string;

  /** Public topic ID(‘s) to filter selection. */
  topics?: string[] | string;

  /** Limit selection to a single user. */
  username?: string;

  /** Filter by photo orientation. Valid values: `landscape`, `portrait`, `squarish`. */
  orientation?: 'landscape' | 'portrait' | 'squarish';

  /**
   * Limit results by content safety. Default: low. Valid values are low and high.
   *
   * See [Unsplash documentation](https://unsplash.com/documentation#content-safety) for more information.
   */
  contentFilter?: 'low' | 'high';

  /** The number of photos to return. (Default: 1; max: 30) */
  count?: number;
};

type UnauthorizedQuery = QueryWithPhotoId | QueryWithCollectionId | QueryWithTopicId | QueryWithUsername | QueryWithKeywords;

const API_URL = 'https://api.unsplash.com';

const SOURCE_URL = 'https://source.unsplash.com';

function buildUnauthorizedQueryUrl(query: UnauthorizedQuery) {
  const url = [SOURCE_URL];

  if ('photoId' in query) {
    url.push(query.photoId);
  } else if ('collectionId' in query) {
    url.push('collection', query.collectionId);
  } else if ('username' in query) {
    url.push('user', query.username);
  } else {
    url.push('random');
  }

  if ('keywords' in query && query.keywords?.trim()) {
    url.push(`?${query.keywords.replace(/\s/g, '')}`);
  }

  return url.join('/');
}

async function fetchAuthorized(query: AuthorizedQuery) {}

/**
 * Fetch an image from Unsplash using the provided query parameters.
 *
 * @param query The query parameters to use when fetching the image.
 */
async function fetchUnauthorized(query: UnauthorizedQuery) {
  const url = buildUnauthorizedQueryUrl(query);
  return fetch(url);
}

export { buildUnauthorizedQueryUrl, fetchAuthorized, fetchUnauthorized };

export type { AuthorizedQuery, UnauthorizedQuery, QueryWithKeywords, QueryWithPhotoId, QueryWithCollectionId, QueryWithTopicId, QueryWithUsername };
