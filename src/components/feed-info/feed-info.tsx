import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  feedTotalSelector,
  feedTotalTodaySelector,
  readyOrdersSelector,
  pendingOrdersSelector
} from '../../services/slices/feed-slice';

export const FeedInfo: FC = () => {
  const total = useAppSelector(feedTotalSelector);
  const totalToday = useAppSelector(feedTotalTodaySelector);
  const readyOrders = useAppSelector(readyOrdersSelector);
  const pendingOrders = useAppSelector(pendingOrdersSelector);

  const feed = { total, totalToday };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
