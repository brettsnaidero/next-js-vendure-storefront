'use client';

import Button from '@/components/button';
import Field from '@/components/form/field';
import Input from '@/components/form/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRequestPasswordResetMutation } from '@/graphql-types.generated';
import styles from '@/styles/pages/forgot-password.module.css';
import Message from '@/components/message';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const [forgotPassword, { loading, data, error }] =
    useRequestPasswordResetMutation();
  const { handleSubmit, register } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPassword({
      variables: {
        emailAddress: data.email,
      },
    });
  };

  return (
    <div className={styles.forgot}>
      <h2>Forgot your password?</h2>

      <div className={styles.layout}>
        {(!!error ||
          data?.requestPasswordReset?.__typename ===
            'NativeAuthStrategyError') && (
          <div className={styles.block}>
            <Message
              type="error"
              text="Sorry, there was an error reaching the server"
            />
          </div>
        )}

        {data?.requestPasswordReset?.__typename === 'Success' ? (
          <Message
            type="info"
            text="If an account with the email address you provided exists, we have sent you an email with instructions on how to reset your password"
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field label="Email" required>
              <Input
                type="email"
                placeholder="Email"
                {...register('email', { required: true })}
                stretched
              />
            </Field>
            <Button type="submit" disabled={loading}>
              Reset password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
