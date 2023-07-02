'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { UpdateCustomerEmailAddressMutation } from '@/providers/account/account';
import { useMutation } from '@apollo/client';
import { UpdateCustomerAddressMutation as UpdateCustomerAddressMutationType } from '@/graphql-types.generated';

const VerifyEmailAddressChangeTokenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [updateCustomerEmailAddress, { data, error }] =
    useMutation<UpdateCustomerAddressMutationType>(
      UpdateCustomerEmailAddressMutation,
      {
        variables: {
          token: searchParams.get('token'),
        },
      },
    );

  // Verify user on load of page
  useEffect(() => {
    if (!data) {
      updateCustomerEmailAddress();
    }
  }, [data, updateCustomerEmailAddress]);

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
                  Your new E-Mail address has been verified successfully.
                  Redirecting in 5s...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailAddressChangeTokenPage;
