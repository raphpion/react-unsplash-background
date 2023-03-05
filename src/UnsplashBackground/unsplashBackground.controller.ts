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

  /** The photo ID(‘s) */
  photoIds?: string[] | string;

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

/**
 * Build a URL to fetch photos from Unsplash using the provided query parameters.
 * This function requires an Unsplash access key.
 *
 * @param query The query parameters to use when fetching the photos.
 * @returns A URL to the photos.
 */
function buildAuthorizedQueryUrl(query: AuthorizedQuery) {
  const url = new URL(`${API_URL}/photos/random`);

  if (query.collectionIds) {
    if (Array.isArray(query.collectionIds)) {
      url.searchParams.append('collections', query.collectionIds.join(','));
    } else {
      url.searchParams.append('collections', query.collectionIds);
    }
  } else if (query.topics) {
    if (Array.isArray(query.topics)) {
      url.searchParams.append('query', query.topics.join(','));
    } else {
      url.searchParams.append('query', query.topics);
    }
  }

  if (query.username) {
    url.searchParams.append('username', query.username);
  }

  if (query.orientation) {
    url.searchParams.append('orientation', query.orientation);
  }

  if (query.contentFilter) {
    url.searchParams.append('content_filter', query.contentFilter);
  }

  const count = query.count ?? 1;
  url.searchParams.append('count', count.toString());

  url.searchParams.append('client_id', query.accessKey);

  return url.toString();
}

/**
 * Build a URL to fetch an image from Unsplash using the provided query parameters.
 * This function does not require an Unsplash access key.
 *
 * @param query The query parameters to use when fetching the image.
 * @returns A URL to the image.
 */
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

/**
 * Fetch a photo from Unsplash using the provided Photo ID.
 *
 * @param id The Photo ID to fetch.
 * @param accessKey The Unsplash access key to use when fetching the photo.
 * @returns A URL to the photo.
 */
async function fetchPhotoById(id: string, accessKey: string) {
  const response = await fetch(`${API_URL}/photos/${id}?client_id=${accessKey}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

/**
 * Fetch photos from Unsplash using the provided Photo IDs.
 *
 * @param photoIds The Photo IDs to fetch.
 * @param accessKey The Unsplash access key to use when fetching the photos.
 *
 * @returns An array of URLs to the photos.
 */
function fetchPhotosById(photoIds: string[] | string, accessKey: string) {
  return Promise.all(Array.isArray(photoIds) ? photoIds.map(photoId => fetchPhotoById(photoId, accessKey)) : [fetchPhotoById(photoIds, accessKey)]);
}

/**
 * Fetch photos from Unsplash using the provided query parameters.
 * This function requires an Unsplash access key.
 *
 * @param query The query parameters to use when fetching the photos.
 * @returns An array of URLs to the photos.
 */
async function fetchAuthorized(query: AuthorizedQuery) {
  if (query.photoIds) {
    return fetchPhotosById(query.photoIds, query.accessKey);
  }

  const url = buildAuthorizedQueryUrl(query);
  const response = await fetch(url);
  const json = await response.json();
  return Promise.all(json.map(async (photo: any) => fetchPhotoById(photo.id, query.accessKey)));
}

/**
 * Fetch an image from Unsplash using the provided query parameters.
 *
 * @param query The query parameters to use when fetching the image.
 */
async function fetchUnauthorized(query: UnauthorizedQuery) {
  const url = buildUnauthorizedQueryUrl(query);
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export { buildUnauthorizedQueryUrl, fetchAuthorized, fetchUnauthorized };

export type { AuthorizedQuery, UnauthorizedQuery, QueryWithKeywords, QueryWithPhotoId, QueryWithCollectionId, QueryWithTopicId, QueryWithUsername };
