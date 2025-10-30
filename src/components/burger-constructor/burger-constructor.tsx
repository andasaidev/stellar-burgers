// src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  createOrder,
  clearOrderModal,
  getConstructorItems,
  orderRequestSelector,
  orderModalDataSelector
} from '../../services/slices/constructor-slice';
import { userSelector } from '../../services/slices/user-slice';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderRequest = useAppSelector(orderRequestSelector);
  const orderModalData = useAppSelector(orderModalDataSelector);
  const user = useAppSelector(userSelector);
  const constructorItems = useAppSelector(getConstructorItems);

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(clearOrderModal());
    }
  }, [location.pathname, dispatch]);

  const onOrderClick = () => {
    // ЗАЩИТА ОТ UNDEFINED
    if (!constructorItems?.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredients));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems?.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems?.ingredients?.reduce(
        (total, item) => total + item.price,
        0
      ) || 0),
    [constructorItems]
  );

  const safeConstructorItems = constructorItems || {
    bun: null,
    ingredients: []
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
