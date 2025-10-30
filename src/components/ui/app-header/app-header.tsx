import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const currentPath = useLocation().pathname;

  const getConstructorLinkState = () => {
    const isConstructorPage = currentPath === '/';
    const isIngredientDetails = currentPath.includes('/ingredients/');
    return isConstructorPage || isIngredientDetails ? 'primary' : 'secondary';
  };

  const getFeedLinkState = () =>
    currentPath.startsWith('/feed') ? 'primary' : 'secondary';

  const getProfileLinkState = () =>
    currentPath.startsWith('/profile') ? 'primary' : 'secondary';

  const getProfileLinkPath = () => (userName ? '/profile' : '/login');

  const getProfileLinkText = () => userName || 'Личный кабинет';

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        {/* Левая часть меню */}
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            end
          >
            <BurgerIcon type={getConstructorLinkState()} />
            <span className='text text_type_main-default ml-2'>
              Конструктор
            </span>
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={getFeedLinkState()} />
            <span className='text text_type_main-default ml-2'>
              Лента заказов
            </span>
          </NavLink>
        </div>

        {/* Центр - логотип */}
        <div className={styles.logo}>
          <NavLink to='/' className={styles.link}>
            <Logo className='' />
          </NavLink>
        </div>

        {/* Правая часть меню */}
        <div className={styles.link_position_last}>
          <NavLink
            to={getProfileLinkPath()}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type={getProfileLinkState()} />
            <span className='text text_type_main-default ml-2'>
              {getProfileLinkText()}
            </span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
