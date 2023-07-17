import { TERM } from '@/utils/use-filtered-product-search';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import styles from '@/styles/components/search.module.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get(TERM) ?? '';

  const [searchValue, setSearchValue] = React.useState(initialQuery);

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newSearchParams = new URLSearchParams();

    newSearchParams.append(TERM, searchValue);

    const search = newSearchParams.toString();
    const query = `${'?'.repeat(search.length && 1)}${search}`;

    router.push(`/search${query}`);
  };

  return (
    <form onSubmit={submit} className={styles.search}>
      <input
        type="search"
        name={TERM}
        placeholder="Search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button} title="Search">
        <MagnifyingGlassIcon width="20" height="20" />
      </button>
    </form>
  );
};

export default SearchBar;
