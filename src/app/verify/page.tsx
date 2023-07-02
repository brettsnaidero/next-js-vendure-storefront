'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { VerifyCustomerAccountMutation } from '@/providers/account/account';
import { useMutation } from '@apollo/client';
import { VerifyCustomerAccountMutation as VerifyCustomerAccountMutationType } from '@/graphql-types.generated';

const VerifyTokenPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifyCustomerAccount, { data, error }] =
    useMutation<VerifyCustomerAccountMutationType>(
      VerifyCustomerAccountMutation,
      {
        variables: {
          token: searchParams.get('token'),
        },
      },
    );

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

  if (error) {
    return (
      <div>
        <div>
          <div>
            <XCircleIcon aria-hidden="true" />
          </div>
          <div>
            <p>{error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>
                <CheckCircleIcon aria-hidden="true" />
              </div>
              <div>
                <p>
                  Your account has been verified successfully. Redirecting in
                  5s...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTokenPage;
