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
import Image from 'next/image';

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
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50.0707 99.9293C21.9236 99.9293 0 77.5813 0 50.1414C0 22.5601 22.4894 0.0707245 50.0707 0.0707245C78.0764 0.0707245 100 22.7016 100 49.7171C100 77.2984 77.7935 99.9293 50.0707 99.9293ZM39.3211 89.7454C64.6393 89.7454 89.8161 64.8515 89.8161 39.2504C89.8161 22.1358 77.9349 10.1132 60.8204 10.1132C35.6436 10.1132 10.3253 35.29 10.3253 60.7496C10.3253 78.0056 22.2065 89.7454 39.3211 89.7454Z"
                fill="currentColor"
              />
              <circle cx="50" cy="50" r="10" fill="currentColor" />
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
