import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  AuthorizedQuery,
  fetchAuthorized,
  fetchUnauthorized,
  QueryWithCollectionId,
  QueryWithKeywords,
  QueryWithPhotoId,
  QueryWithTopicId,
  QueryWithUsername
} from './unsplashBackground.controller';

import './unsplashBackground.css';

interface PropsWithCssProperties {
  style?: CSSProperties;
}

interface PropsWithAuthorizedQuery extends AuthorizedQuery, PropsWithCssProperties, PropsWithChildren {
  /** Delay, in milliseconds, before a new image will be fetched. (Default: 5000ms) */
  delay?: number;
}
interface PropsWithPhotoId extends QueryWithPhotoId, PropsWithCssProperties, PropsWithChildren { }
interface PropsWithCollectionId extends QueryWithCollectionId, PropsWithCssProperties, PropsWithChildren { }
interface PropsWithTopicId extends QueryWithTopicId, PropsWithCssProperties, PropsWithChildren { }
interface PropsWithUsername extends QueryWithUsername, PropsWithCssProperties, PropsWithChildren { }
interface PropsWithKeywords extends QueryWithKeywords, PropsWithCssProperties, PropsWithChildren { }

type PropsWithUnauthorizedQuery =
  | PropsWithPhotoId
  | PropsWithCollectionId
  | PropsWithTopicId
  | PropsWithUsername
  | PropsWithKeywords

type UnsplashBackgroundProps =
  | PropsWithAuthorizedQuery
  | PropsWithUnauthorizedQuery

function UnsplashBackground({ children, ...props }: UnsplashBackgroundProps): JSX.Element {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!('accessKey' in props)) {
      fetchUnauthorized(props)
        .then((result) => {
          setImages((images) => [result]);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      fetchAuthorized(props)
        .then((result) => {
          console.log(result);
          setImages((images) => result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!('accessKey' in props) || !images.length) {
      return () => { };
    }

    const interval = setInterval(() => {
      setIndex((index) => (index + 1) % images.length);
    }, props.delay ?? 5000);

    return () => clearInterval(interval);
  }, [images]);

  const imageUrl = useMemo(() => {
    if (!images.length) {
      return undefined;
    }

    return images[index];
  }, [images, index]);

  const style: CSSProperties = {
    ...props.style,
    ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}),
  };


  return <div className="rp-unsplash-background" style={style}>{children}</div>;
}

export default UnsplashBackground;

export { UnsplashBackground };

export type {
  UnsplashBackgroundProps,
  PropsWithAuthorizedQuery,
  PropsWithPhotoId,
  PropsWithCollectionId,
  PropsWithUsername,
  PropsWithTopicId,
  PropsWithKeywords,
};