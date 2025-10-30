import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/slices/ingredients-slice';
import { feedOrdersSelector } from '../../services/slices/feed-slice';
import { profileOrdersSelector } from '../../services/slices/orders-slice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients = useAppSelector(ingredientsSelector);
  const feedOrders = useAppSelector(feedOrdersSelector);
  const profileOrders = useAppSelector(profileOrdersSelector);

  const orderData = useMemo(() => {
    const orderNumber = number ? parseInt(number) : 0;
    return (
      feedOrders.find((order: TOrder) => order.number === orderNumber) ||
      profileOrders.find((order: TOrder) => order.number === orderNumber)
    );
  }, [number, feedOrders, profileOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
