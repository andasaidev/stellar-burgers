import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/slices/ingredients-slice';
import { feedOrdersSelector } from '../../services/slices/feed-slice';
import { profileOrdersSelector } from '../../services/slices/orders-slice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(ingredientsSelector);
  const feedOrders = useAppSelector(feedOrdersSelector);
  const profileOrders = useAppSelector(profileOrdersSelector);
  const [directOrder, setDirectOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!number) return;

    const fetchDirectOrder = async () => {
      try {
        const orderNumber = parseInt(number);
        const response = await getOrderByNumberApi(orderNumber);
        const order = response.orders?.[0] || response;
        setDirectOrder(order as TOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    const orderNumber = parseInt(number);
    const orderInStore =
      feedOrders.find((order) => order.number === orderNumber) ||
      profileOrders.find((order) => order.number === orderNumber);

    if (!orderInStore) {
      fetchDirectOrder();
    }
  }, [number, feedOrders, profileOrders]);

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);

    return (
      directOrder ||
      feedOrders.find((order) => order.number === orderNumber) ||
      profileOrders.find((order) => order.number === orderNumber)
    );
  }, [number, directOrder, feedOrders, profileOrders]);

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
