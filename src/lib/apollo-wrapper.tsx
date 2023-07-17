'use client';

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  SuspenseCache,
} from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { setContext } from '@apollo/client/link/context';

const vendureApi = process.env.NEXT_PUBLIC_VENDURE_SHOP_API;
const authTokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY as string;

let token: string;

// TODO: Should we be using session storage or local storage?
// "the difference is that while data in localStorage doesn't expire,
// data in sessionStorage is cleared when the page session ends."

export function ApolloWrapper({
  children,
  cookie,
}: React.PropsWithChildren<{ cookie: string | null }>) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );

  function makeClient() {
    const httpLink = new HttpLink({
      uri: vendureApi,
      credentials: 'include',
    });

    const authLink = setContext(async () => {
      if (typeof window === 'undefined') {
        return {
          headers: {
            cookie,
          },
        };
      }

      const localAuthToken = sessionStorage.getItem(authTokenKey);

      if (localAuthToken) {
        // If we have stored the authToken from a previous
        // response, we attach it to all subsequent requests.
        return {
          headers: {
            authorization: `Bearer ${localAuthToken}`,
          },
        };
      }
    });

    const afterwareLink = new ApolloLink((operation, forward) => {
      return forward(operation).map((response) => {
        const context = operation.getContext();
        const authHeader = context.response.headers.get('vendure-auth-token');

        if (authHeader) {
          if (typeof window === 'undefined') {
            token = authHeader;
          } else {
            // If the auth token has been returned by the Vendure
            // server, we store it in localStorage
            sessionStorage.setItem(authTokenKey, authHeader);
          }
        }
        return response;
      });
    });

    const isomorphicLinks = [authLink, afterwareLink, httpLink];

    return new ApolloClient({
      cache: new NextSSRInMemoryCache(),
      link:
        typeof window === 'undefined'
          ? ApolloLink.from([
              new SSRMultipartLink({
                stripDefer: true,
              }),
              ...isomorphicLinks,
            ])
          : ApolloLink.from(isomorphicLinks),
    });
  }

  function makeSuspenseCache() {
    return new SuspenseCache();
  }
}
