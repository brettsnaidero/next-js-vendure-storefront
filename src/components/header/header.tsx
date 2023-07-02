import React from 'react';
import Link from 'next/link';
import SearchBar from '@/components/header/search-bar';
import { useScrollingUp } from '@/utils/use-scrolling-up';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const Header = ({
  onCartIconClick,
  cartQuantity,
}: {
  onCartIconClick: () => void;
  cartQuantity: number;
}) => {
  // TODO: useRootLoader replace
  const isSignedIn = false; // !!data.activeCustomer.activeCustomer?.id;
  const isScrollingUp = useScrollingUp();
  const data = {};

  return (
    <header className={isScrollingUp ? 'sticky' : ''}>
      <div>
        <div>
          <div>
            <p>
              Exclusive: Get your own{' '}
              <a href="TODO" target="_blank">
                FREE storefront starter kit
              </a>
            </p>
          </div>
          <div>
            <Link href={isSignedIn ? '/account' : '/sign-in'}>
              <UserIcon></UserIcon>
              <span>{isSignedIn ? 'My Account' : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <h1>
          <Link href="/">
            <Image
              src="/cube-logo-small.webp"
              width={40}
              height={31}
              alt="Vendure logo"
            />
          </Link>
        </h1>
        <div>
          {data?.collections.map((collection) => (
            <Link
              href={'/collections/' + collection.slug}
              // prefetch="intent"
              key={collection.id}
            >
              {collection.name}
            </Link>
          ))}
        </div>
        <div>
          <SearchBar></SearchBar>
        </div>
        <div>
          <button onClick={onCartIconClick} aria-label="Open cart tray">
            <ShoppingBagIcon></ShoppingBagIcon>
            {cartQuantity ? <div>{cartQuantity}</div> : ''}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
