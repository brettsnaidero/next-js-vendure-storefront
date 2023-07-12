'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PencilIcon } from '@heroicons/react/24/outline';
import Button, { ButtonTray } from '@/components/button';
import { useUpdateCustomerPasswordMutation } from '@/graphql-types.generated';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import Message from '@/components/message';

export const validator = z
  .object({
    currentPassword: z.string().min(1, { message: 'Password is required' }),
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

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPassword = () => {
  const [editing, setEditing] = useState(false);

  const [updatePassword, { loading, data, error }] =
    useUpdateCustomerPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(validator),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const submit = ({ currentPassword, newPassword }: FormFields) => {
    updatePassword({
      variables: {
        currentPassword,
        newPassword,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        {editing && (
          <>
            <div>
              <Field
                label="Current Password"
                htmlFor="change-password__current"
                errorMessage={errors.currentPassword?.message}
              >
                <Input
                  id="change-password__current"
                  type="password"
                  {...register('currentPassword')}
                  stretched
                />
              </Field>
            </div>
            <div>
              <Field
                label="New Password"
                htmlFor="change-password__new"
                errorMessage={errors.newPassword?.message}
              >
                <Input
                  id="change-password__new"
                  type="password"
                  {...register('newPassword')}
                  stretched
                />
              </Field>
              <Field
                label="Confirm Password"
                errorMessage={errors.confirmPassword?.message}
                htmlFor={'change-password__confirm'}
              >
                <Input
                  id="change-password__confirm"
                  type="password"
                  {...register('confirmPassword')}
                  stretched
                />
              </Field>
            </div>
          </>
        )}

        {data?.updateCustomerPassword?.__typename === 'Success' && (
          <Message
            type="success"
            headingText="Success!"
            text="Your password has been updated."
          />
        )}

        {error && (
          <Message
            type="error"
            headingText="Password not updated"
            text="There was an error reaching the server."
          />
        )}

        {data?.updateCustomerPassword &&
        data?.updateCustomerPassword.__typename !== 'Success' ? (
          <Message
            type="error"
            headingText="Password not updated"
            text={data?.updateCustomerPassword?.message}
          />
        ) : null}

        {editing ? (
          <ButtonTray>
            <Button type="submit" disabled={loading}>
              Save Password
            </Button>
            <Button
              type="reset"
              onClick={() => setEditing(false)}
              role="secondary"
            >
              Cancel
            </Button>
          </ButtonTray>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => setEditing(true)}
              icon={<PencilIcon width={20} height={20} />}
              iconPosition="right"
            >
              Change Password
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default AccountPassword;
