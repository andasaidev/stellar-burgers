import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  feedOrdersSelector,
  feedLoadingSelector
} from '../../services/slices/feed-slice';
import { fetchFeed } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(feedOrdersSelector);
  const loading = useAppSelector(feedLoadingSelector);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
