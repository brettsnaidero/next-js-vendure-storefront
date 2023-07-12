'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPasswordMutation } from '@/graphql-types.generated';
import Message from '@/components/message';
import Button from '@/components/button';
import Field from '@/components/form/field';
import Input from '@/components/form/input';
import styles from '@/styles/pages/forgot-password.module.css';

export const validator = z
  .object({
    newPassword: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Password is required' }),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords must match',
    },
  );

interface ResetPasswordForm {
  token: string;
  newPassword: string;
  passwordConfirm: string;
}

const ResetPassword = ({
  params,
}: {
  params: {
    token: string;
  };
}) => {
  const [resetPassword, { loading, data, error }] = useResetPasswordMutation();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      token: params.token,
      newPassword: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    resetPassword({
      variables: {
        token: params.token,
        password: data.newPassword,
      },
    });
  };

  useEffect(() => {
    if (data?.resetPassword?.__typename === 'CurrentUser') {
      // TODO
    }
  }, [data]);

  return (
    <div className={styles.forgot}>
      <h2>Forgot your password?</h2>

      <div className={styles.layout}>
        {(!!error ||
          data?.resetPassword?.__typename === 'NativeAuthStrategyError') && (
          <div className={styles.block}>
            <Message
              type="error"
              text="Sorry, there was an error reaching the server"
            />
          </div>
        )}

        {data?.resetPassword?.__typename === 'CurrentUser' ? (
          <Message
            type="success"
            text="Your account password has been successfully reset"
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="New password"
              required
              errorMessage={errors.newPassword?.message}
            >
              <Input
                type="password"
                placeholder="New password"
                {...register('newPassword', { required: true })}
                stretched
              />
            </Field>
            <Field
              label="Confirm new password"
              required
              errorMessage={errors.passwordConfirm?.message}
            >
              <Input
                type="password"
                placeholder="Confirm new password"
                {...register('passwordConfirm', { required: true })}
                stretched
              />
            </Field>
            <Button type="submit" disabled={!isValid || loading}>
              Reset password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
