'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Button from '@/components/button';
import styles from '@/styles/pages/sign-in.module.css';
import Field from '@/components/form/field';
import Input from '@/components/form/input';
import Checkbox from '@/components/form/checkbox';
import Message from '@/components/message';
import { ActiveCustomerContext } from '@/lib/active-customer-wrapper';
import { useLoginMutation } from '@/graphql-types.generated';
import { ActiveOrderContext } from '@/lib/active-order-wrapper';

export interface LogInFormData {
  email: string;
  password: string;
  remember: boolean;
}

const SignInPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invalidError, setInvalidError] = useState(false);

  const [logIn, { data: logInData, loading: logInloading }] =
    useLoginMutation();

  const { refresh } = useContext(ActiveOrderContext);
  const { activeCustomer, refetch } = useContext(ActiveCustomerContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogInFormData>({
    defaultValues: {
      email: 'test@vendure.io',
      password: 'test',
      remember: true,
    },
  });

  const submit = (data: LogInFormData) => {
    logIn({
      variables: {
        email: data.email,
        password: data.password,
        rememberMe: data.remember,
      },
    });
  };

  useEffect(() => {
    if (logInData?.login?.__typename === 'CurrentUser') {
      const redirectTo = searchParams.get('redirectTo') || '/account';

      // Refresh customer and cart data
      refetch();
      refresh?.();

      router.push(redirectTo);
    } else if (logInData?.login?.__typename === 'InvalidCredentialsError') {
      // do nothing
      setInvalidError(true);
    } else if (logInData?.login?.__typename === 'NotVerifiedError') {
      router.push('/verify-email-address');
    }
  }, [logInData, router, searchParams]);

  useEffect(() => {
    if (activeCustomer?.id) {
      router.push('/account');
    }
  }, [activeCustomer, router]);

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h2>Sign in to your account</h2>
        <p>
          Or <Link href="/sign-up">register a new account</Link>
        </p>
      </div>

      <div className={styles.layout}>
        <div>
          <form onSubmit={handleSubmit(submit)}>
            <fieldset disabled={logInloading}>
              <Field
                label="Email address"
                htmlFor="sign-in__email"
                required
                errorMessage={errors.email?.message}
              >
                <Input
                  id="sign-in__email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  {...register('email', { required: true })}
                  stretched
                />
              </Field>

              <Field
                label="Password"
                htmlFor="sign-in__password"
                required
                errorMessage={errors.password?.message}
              >
                <Input
                  id="sign-in__password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  {...register('password', { required: true })}
                  stretched
                />
              </Field>

              <Field>
                <Checkbox id="sign-in__remember-me" {...register('remember')}>
                  <label htmlFor="sign-in__remember-me">Remember me</label>
                </Checkbox>
              </Field>

              <div className={styles.block}>
                <Link href="/forgot-password">Forgot your password?</Link>
              </div>

              {invalidError && (
                <div className={styles.block}>
                  <Message
                    type="error"
                    text="Sorry, we couldn't log you in."
                    closable
                  />
                </div>
              )}

              <div className={styles.block}>
                <Button
                  type="submit"
                  icon={
                    logInloading ? (
                      <ArrowPathIcon width={20} height={20} />
                    ) : null
                  }
                  size="large"
                >
                  Sign in
                </Button>
              </div>
            </fieldset>
          </form>
        </div>

        <div>
          <Message
            headingText="Demo credentials"
            text="Email address: test@vendure.io, Password: test"
            size="large"
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
