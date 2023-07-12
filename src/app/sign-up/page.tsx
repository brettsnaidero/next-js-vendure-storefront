'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRegisterCustomerAccountMutation } from '@/graphql-types.generated';
import Button from '@/components/button';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import Message from '@/components/message';
import { ActiveCustomerContext } from '@/lib/active-customer-wrapper';
import LoadingPage from '@/components/loading';
import styles from '@/styles/pages/sign-in.module.css';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const [registerCustomerAccount, { data, loading }] =
    useRegisterCustomerAccountMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { activeCustomer } = useContext(ActiveCustomerContext);

  const submitForm = async ({
    email,
    firstName,
    lastName,
    password,
  }: // repeatPassword,
  FormData) => {
    registerCustomerAccount({
      variables: {
        input: {
          emailAddress: email,
          firstName,
          lastName,
          password,
        },
      },
    });
  };

  useEffect(() => {
    if (activeCustomer?.id) {
      // Logged in users should not be on this page
      router.push('/account');
    }
  }, [activeCustomer, router]);

  useEffect(() => {
    if (data?.registerCustomerAccount?.__typename === 'Success') {
      router.push('/sign-up/success');
    }
  }, [data]);

  if (activeCustomer?.id) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h2>Create a new account</h2>
        <p>
          Or <Link href="/sign-in">login to your existing account</Link>
        </p>
      </div>

      <div className={styles.layout}>
        <div>
          <p>
            Account registration is not supported by the demo Vendure instance.
            In order to use it, please connect the Next storefront to your own
            local / production instance.
          </p>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          <fieldset disabled={loading} aria-busy={loading}>
            <Field
              label="Email address"
              htmlFor="email"
              errorMessage={errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', { required: true })}
                stretched
              />
            </Field>

            <Field
              label="First name"
              htmlFor="firstName"
              errorMessage={errors.firstName?.message}
            >
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register('firstName', { required: true })}
                stretched
              />
            </Field>

            <Field
              label="Last name"
              htmlFor="lastName"
              errorMessage={errors.lastName?.message}
            >
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                {...register('lastName', { required: true })}
                stretched
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              errorMessage={errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: true })}
                stretched
              />
            </Field>

            <Field
              label="Repeat Password"
              htmlFor="repeatPassword"
              errorMessage={errors.repeatPassword?.message}
            >
              <Input
                id="repeatPassword"
                type="password"
                autoComplete="current-password"
                {...register('repeatPassword')}
                stretched
              />
            </Field>

            {data?.registerCustomerAccount &&
              data.registerCustomerAccount?.__typename !== 'Success' && (
                <div>
                  <Message
                    type="error"
                    headingText="We ran into a problem while creating your account"
                    text={data.registerCustomerAccount.message}
                  />
                </div>
              )}

            <Button type="submit" disabled={loading}>
              Sign up
            </Button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
