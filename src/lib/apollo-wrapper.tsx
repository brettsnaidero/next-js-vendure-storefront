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

const vendureApi = process.env.NEXT_PUBLIC_VENDURE_SHOP_API as string;
const authTokenKey = process.env.AUTH_TOKEN_KEY as string;

function makeClient() {
  const httpLink = new HttpLink({
    uri: vendureApi,
    headers: {},
    credentials: 'include',
  });

  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const authHeader = context.response.headers.get('vendure-auth-token');
      if (authHeader) {
        // If the auth token has been returned by the Vendure
        // server, we store it in localStorage
        localStorage.setItem(authTokenKey, authHeader);
      }
      return response;
    });
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            setContext(async () => {
              const authToken = localStorage.getItem(authTokenKey);
              if (authToken) {
                // If we have stored the authToken from a previous
                // response, we attach it to all subsequent requests.
                return {
                  headers: {
                    authorization: `Bearer ${authToken}`,
                  },
                };
              }
            }),
            afterwareLink,
            httpLink,
          ])
        : httpLink,
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
