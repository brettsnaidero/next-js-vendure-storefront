import React, { useContext } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import SearchBar from '@/components/header/search-bar';
import Button from '@/components/button';
import { useScrollingUp } from '@/utils/use-scrolling-up';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { SunIcon, MoonIcon, UserIcon } from '@heroicons/react/24/solid';
import { CollectionsQuery } from '@/graphql-types.generated';
import styles from '@/styles/components/header.module.css';
import { ThemeContext, Theme } from '@/lib/theme-wrapper';
import { ActiveCustomerContext } from '@/lib/active-customer-wrapper';

const Header = ({
  onCartIconClick,
  cartQuantity,
  collections,
}: {
  onCartIconClick: () => void;
  cartQuantity: number;
  collections: CollectionsQuery['collections']['items'];
}) => {
  const { activeCustomer } = useContext(ActiveCustomerContext);
  const isSignedIn = !!activeCustomer?.id;
  const isScrollingUp = useScrollingUp();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleDarkMode = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    toggleTheme(newTheme);
  };

  return (
    <header className={clsx([styles.header, isScrollingUp ? 'sticky' : ''])}>
      <div className={styles.top}>
        <Link
          href={isSignedIn ? '/account' : '/sign-in'}
          className={styles.account}
        >
          <UserIcon width={20} height={20} />
          <span>{isSignedIn ? 'My Account' : 'Sign In'}</span>
        </Link>

        <button
          type="button"
          onClick={() => toggleDarkMode()}
          className={styles.theme}
        >
          {theme === 'dark' ? (
            <SunIcon width={20} height={20} />
          ) : (
            <MoonIcon width={20} height={20} />
          )}
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </button>
      </div>

      <div className={styles.main}>
        <h1 className={styles.logo}>
          <Link href="/" className={styles.link}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48.77 46.886"
              width="80px"
              className={styles.image}
            >
              <path
                fill="currentColor"
                d="M48.462 2.366a3.941 3.941 0 0 0-1.17-.677.124.124 0 0 0-.013.021c-2.416 1.613-5.357 1.026-6.958.501a61.867 61.867 0 0 0-1.18-.464A35.725 35.725 0 0 0 35.189.515a18.865 18.865 0 0 0-7.744-.217 8.227 8.227 0 0 0-4.305 1.948 4.711 4.711 0 0 0-1.5 4.328 5.094 5.094 0 0 0 1.653 2.6 15.146 15.146 0 0 0 2.591 1.742l.467.27c-.04.031-.082.061-.121.1a1.911 1.911 0 0 0-.761 1.46 3.666 3.666 0 0 0 .8 2.158 13.838 13.838 0 0 1 .846 1.374 2.022 2.022 0 0 1 .169.867 7.723 7.723 0 0 1-.317 2.031 15.457 15.457 0 0 1-.888 2.368 20.2 20.2 0 0 1-1.333 2.411 14.035 14.035 0 0 1-1.65 2.115q-2.073 2.327-4.146 2.327a2.7 2.7 0 0 1-2.28-1.066 4.88 4.88 0 0 1-.8-3 12.745 12.745 0 0 1 .169-2.137 12.035 12.035 0 0 1 .635-2.221 24.175 24.175 0 0 1 .931-2.284 21.749 21.749 0 0 1 1.142-2.156 15.842 15.842 0 0 0 .953-1.883 4.049 4.049 0 0 0 .359-1.5q0-1.524-1.439-1.523a3.662 3.662 0 0 0-1.4.3 3.7 3.7 0 0 0-1.227.8 1.273 1.273 0 0 0-.549.93 1.068 1.068 0 0 0 .169.508 7.5 7.5 0 0 1 .635 1.544 6.093 6.093 0 0 1 .169 1.5q0 3.385-2.962 7.488a18.915 18.915 0 0 1-3.258 3.532 4.627 4.627 0 0 1-2.75 1.206 2.11 2.11 0 0 1-1.734-.782 3.374 3.374 0 0 1-.635-2.179 10.657 10.657 0 0 1 .825-3.68 23.917 23.917 0 0 1 2.305-4.441 6.37 6.37 0 0 1 .593-.867q.548-.74 1.248-1.692t1.438-1.9q.74-.95 1.206-1.5a.7.7 0 0 0 .253-.465.449.449 0 0 0-.147-.318.449.449 0 0 0-.318-.147 1.485 1.485 0 0 0-.423.169 3.681 3.681 0 0 1-1.734.4q-1.059.021-1.735.021-.38 0-.7-.021t-.741-.022c-.282 0-.628-.006-1.036-.021s-.924-.022-1.545-.022a4.455 4.455 0 0 0-.507.022 1.412 1.412 0 0 0-.424.147 4.259 4.259 0 0 0-.825.635 9.523 9.523 0 0 0-.909 1.016 10.662 10.662 0 0 0-1.375 2.348 5.727 5.727 0 0 0-.529 2.178 2.454 2.454 0 0 0 .577 1.65 1.852 1.852 0 0 0 1.476.677 1.962 1.962 0 0 0 1.367-.551 1.676 1.676 0 0 0 .6-1.268 1.365 1.365 0 0 0-.359-.973 1.252 1.252 0 0 0-.952-.381 1.168 1.168 0 0 0-.761.212.9.9 0 0 1-.593.212c-.226 0-.338-.142-.338-.424a2.112 2.112 0 0 1 .719-1.628 2.593 2.593 0 0 1 1.819-.657 17.184 17.184 0 0 1 1.724.085 18.066 18.066 0 0 0 1.806.084 6.125 6.125 0 0 0 1.426-.127 3.687 3.687 0 0 0 1.092-.508q-.423.636-.909 1.355t-.973 1.417q-.487.7-.888 1.268t-.614.867q-.973 1.311-1.628 2.264T3.47 22.572a11.153 11.153 0 0 0-.74 1.354 13.052 13.052 0 0 0-.486 1.248 5.233 5.233 0 0 0-.255 1.057 8.084 8.084 0 0 0-.084 1.143 3.932 3.932 0 0 0 1.077 2.88 3.659 3.659 0 0 0 2.729 1.1 5.284 5.284 0 0 0 3.13-1.1 16.977 16.977 0 0 0 3.384-3.6q.38-.508.655-.889t.508-.76c.154-.255.31-.515.465-.783s.344-.585.571-.951l.168.127a13.13 13.13 0 0 0-.888 2.348 8.541 8.541 0 0 0-.3 2.178 3.512 3.512 0 0 0 .953 2.5 3.186 3.186 0 0 0 2.432 1.015 6.152 6.152 0 0 0 2.729-.676 11.326 11.326 0 0 0 2.707-1.925 19.409 19.409 0 0 0 2.58-3.025 31.215 31.215 0 0 0 2.348-3.976 33.953 33.953 0 0 0 1.439-3.448 23.988 23.988 0 0 0 .888-3.363c.056-.366.106-.741.147-1.121a8.6 8.6 0 0 0 .063-.91 2.811 2.811 0 0 0-.486-1.713 1.491 1.491 0 0 0-1.248-.655 2.62 2.62 0 0 0-.643.079 8.282 8.282 0 0 1-2.1-2.465 4.85 4.85 0 0 1-.31-4.107 4.824 4.824 0 0 1 2.395-2.35 9.094 9.094 0 0 1 3.32-.766 16.553 16.553 0 0 1 7.288 1.187 16.323 16.323 0 0 1 3.258 1.773c.9.631 1.949 1.492 1.949 2.7s-1.236 3.35-2.036 4.617l-.007.017c-.048.077-.1.153-.149.23-.167.252-.335.5-.506.764q-1.377 2.073-2.609 3.922t-2.136 3.183q-.9 1.334-1.15 1.663-.123.164-.821 1.191l-1.745 2.567q-1.049 1.541-2.382 3.471l-2.712 3.922c-.917 1.328-4.486 6.651-5.362 7.884s-1.67 2.327-2.382 3.285a8.31 8.31 0 0 0-.7 1.13 1.947 1.947 0 0 0-.206.842q0 1.108 1.438 1.519c.22-.356.446-.713.678-1.068s.458-.726.677-1.109q1.109-1.766 2.567-4.046c.972-1.519 4.686-7.158 5.794-8.828s2.245-3.36 3.41-5.072 2.28-3.361 3.348-4.949l1.683-2.465 2.075-3.039q1.09-1.601 2.236-3.265t2.219-3.182q1.067-1.519 1.991-2.813t1.544-2.116a8.51 8.51 0 0 0 .7-1.047 1.552 1.552 0 0 0 .2-.719 1.084 1.084 0 0 0-.308-.8"
              ></path>
            </svg>
          </Link>
        </h1>

        <ul className={styles.collections}>
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link href={'/collections/' + collection.slug}>
                {collection.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <div className={styles.search}>
            <SearchBar />
          </div>

          <div className={styles.cart}>
            <Button
              onClick={onCartIconClick}
              aria-label="Open cart tray"
              icon={<ShoppingBagIcon width={20} height={20} />}
            >
              {cartQuantity ? <div>{cartQuantity}</div> : ''}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
