import React from 'react';

const SearchBar = () => {
  let initialQuery = '';
  if (typeof window === 'undefined') {
    // running in a server environment
  } else {
    // running in a browser environment
    initialQuery = new URL(window.location.href).searchParams.get('q') ?? '';
  }

  const submit = () => {};

  return (
    <form onSubmit={submit}>
      <input
        type="search"
        name="q"
        defaultValue={initialQuery}
        placeholder="Search"
      />
    </form>
  );
};

export default SearchBar;
