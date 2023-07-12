'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useVerifyCustomerAccountMutation } from '@/graphql-types.generated';

const VerifyTokenPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [verifyCustomerAccount, { data, error }] =
    useVerifyCustomerAccountMutation({
      variables: {
        token: searchParams.get('token') ?? '',
      },
    });

  // Verify user on load of page
  useEffect(() => {
    if (!data) {
      verifyCustomerAccount();
    }
  }, [data, verifyCustomerAccount]);

  // Redirect user if all went well
  useEffect(() => {
    if (data && !error) {
      setTimeout(() => {
        router.push(searchParams.get('redirectTo') || '/');
      }, 5000);
    }
  }, [data, router, searchParams, error]);

  if (!searchParams.get('token')) {
    router.replace('/');

    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <div>
          <XCircleIcon width={20} height={20} aria-hidden="true" />
        </div>
        <div>
          <p>{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <CheckCircleIcon width={20} height={20} aria-hidden="true" />
      </div>
      <div>
        <p>Your account has been verified successfully. Redirecting in 5s...</p>
      </div>
    </div>
  );
};

export default VerifyTokenPage;
