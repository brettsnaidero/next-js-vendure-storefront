'use client';

import { RegisterCustomerAccountMutation } from '@/providers/account/account';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { RegisterCustomerAccountMutation as RegisterCustomerAccountMutationType } from '@/graphql-types.generated';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
}

const SignUpPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [registerCustomerAccount, { data, error }] =
    useMutation<RegisterCustomerAccountMutationType>(
      RegisterCustomerAccountMutation,
    );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const submitForm = async ({
    email,
    firstName,
    lastName,
    password,
    repeatPassword,
  }: FormData) => {
    registerCustomerAccount({
      variables: {
        input: {
          emailAddress: email,
          firstName,
          lastName,
          password,
          repeatPassword,
        },
      },
    });
  };

  if (data?.registerCustomerAccount?.__typename === 'Success') {
    router.push('/sign-up/success');
  }

  return (
    <div>
      <div>
        <h2>Create a new account</h2>
        <p>
          Or <Link href="/sign-in">login to your existing account</Link>
        </p>
      </div>

      <div>
        <div>
          <div>
            <p>
              Account registration is not supported by the demo Vendure
              instance. In order to use it, please connect the Next storefront
              to your own local / production instance.
            </p>
          </div>
          <form onSubmit={handleSubmit(submitForm)}>
            <div>
              <label htmlFor="email">Email address</label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors?.email && errors.email.message}
              </div>
            </div>

            <div>
              <label htmlFor="firstName">First name</label>
              <div>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  {...register('firstName')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName">Last name</label>
              <div>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  {...register('lastName')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors?.password && errors.password.message}
              </div>
            </div>
            <div>
              <label htmlFor="repeatPassword">Repeat Password</label>
              <div>
                <input
                  id="repeatPassword"
                  type="password"
                  autoComplete="current-password"
                  {...register('repeatPassword')}
                />
                {errors?.repeatPassword && errors.repeatPassword.message}
              </div>
            </div>

            {error && (
              <div>
                <div>
                  <div>
                    <XCircleIcon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>We ran into a problem while creating your account!</h3>
                    <p>{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button type="submit">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
