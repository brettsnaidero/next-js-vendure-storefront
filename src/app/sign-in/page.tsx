'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginMutation } from '@/providers/account/account';
import { XCircleIcon } from '@heroicons/react/24/solid';
('use client');

import { Button } from '@/components/button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { LoginMutation as LoginMutationType } from '@/graphql-types.generated';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage = async () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [postLogin, { data, error }] =
    useMutation<LoginMutationType>(LoginMutation);

  const submitForm = ({ email, password, rememberMe }: FormData) => {
    postLogin({
      variables: {
        email,
        password,
        rememberMe,
      },
    });
  };

  if (data?.login?.__typename === 'CurrentUser') {
    const redirectTo = (searchParams.get('redirectTo') || '/account') as string;

    return router.push(redirectTo);
  }

  return (
    <div>
      <div>
        <h2>Sign in to your account</h2>
        <p>
          Or <Link href="/sign-up">register a new account</Link>
        </p>
      </div>

      <div>
        <div>
          <div>
            <p>Demo credentials</p>
            <p>
              Email address: <span>test@vendure.io</span>
            </p>
            <p>
              Password: <span>test</span>
            </p>
          </div>
          <form onSubmit={handleSubmit(submitForm)}>
            <fieldset disabled={!!error}>
              <input
                type="hidden"
                name="redirectTo"
                value={searchParams.get('redirectTo') ?? undefined}
              />
              <div>
                <label htmlFor="email">Email address</label>
                <div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue="test@vendure.io"
                    placeholder="Email address"
                    {...register('email')}
                  />
                  {errors?.email && errors.email.message}
                </div>
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    defaultValue="test"
                    {...register('password')}
                  />
                  {errors?.password && errors.password.message}
                </div>
              </div>

              <div>
                <div>
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register('rememberMe')}
                    defaultChecked
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>

                <div>
                  <Link href="/forgot-password">Forgot your password?</Link>
                </div>
              </div>

              {error && (
                <div>
                  <div>
                    <div>
                      <XCircleIcon aria-hidden="true" />
                    </div>
                    <div>
                      <h3>We ran into a problem signing you in!</h3>
                      <p>{error.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button type="submit">
                  <span>
                    {!error && <ArrowPathIcon />}
                    Sign in
                  </span>
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
