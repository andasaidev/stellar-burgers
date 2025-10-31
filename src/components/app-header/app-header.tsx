import { FC } from 'react';

import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { userSelector } from '../../services/slices/user-slice';

export const AppHeader: FC = () => {
  const user = useAppSelector(userSelector);
  return <AppHeaderUI userName={user?.name || ''} />;
};
