'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUpdateCustomerEmailAddressMutation } from '@/graphql-types.generated';
import Message from '@/components/message';
import LoadingPage from '@/components/loading';

const VerifyEmailAddressChangeTokenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [updateCustomerEmailAddress, { data, error }] =
    useUpdateCustomerEmailAddressMutation({
      variables: {
        token: searchParams.get('token') || '',
      },
    });

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

  useEffect(() => {}, []);

  if (error) {
    return (
      <div className="page">
        <Message type="error" text={error?.message} />
      </div>
    );
  }

  // TODO: If already logged in, redirect user

  if (!searchParams.get('token')) {
    return (
      <div className="page">
        <Message
          type="info"
          text="Your new email address has been not yet been verified. Please check your inbox for your verification link."
        />
      </div>
    );
  }

  return (
    <div className="page">
      <Message
        type="success"
        text="Your new email address has been verified successfully. Redirecting in 5 seconds..."
      />
    </div>
  );
};

export default VerifyEmailAddressChangeTokenPage;
