import { PencilIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/button';
import { ErrorMessage } from '@/components/error-message';
import { HighlightedButton } from '@/components/highlighted-button';
import { Input } from '@/components/input';
import { SuccessMessage } from '@/components/success-message';
import { UpdateCustomerPasswordMutation } from '@/providers/account/account';
import { UpdateCustomerPasswordMutation as UpdateCustomerPasswordMutationType } from '@/graphql-types.generated';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

export default function AccountPassword() {
  const [editing, setEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const [action, { loading }] = useMutation<UpdateCustomerPasswordMutationType>(
    UpdateCustomerPasswordMutation,
  );

  // TODO: Register inputs/form
  const { register, reset, handleSubmit } = useForm({
    resolver: zodResolver(validator),
  });

  const submit = () => {
    action()
      .then(() => {
        // Show success message and reset form
        setErrorMessage(undefined);
        setIsSaved(true);
        setEditing(false);
        reset();
      })
      .catch(() => {
        // Set error message
        setErrorMessage('Error updating password');
        setIsSaved(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div>
        {editing && (
          <>
            <div>
              <div>
                <Input
                  required
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                />
              </div>
            </div>
            <div>
              <div>
                <Input
                  required
                  label="New Password"
                  name="newPassword"
                  type="password"
                />
              </div>
              <div>
                <Input
                  required
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
              </div>
            </div>
          </>
        )}
        {isSaved && (
          <SuccessMessage
            heading="Success!"
            message="Your password has been updated."
          />
        )}
        {errorMessage && (
          <ErrorMessage
            heading="Password not updated."
            message={errorMessage}
          />
        )}
        {editing ? (
          <div>
            <HighlightedButton type="submit" isSubmitting={loading}>
              Save Password
            </HighlightedButton>
            <Button type="reset" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <HighlightedButton type="button" onClick={() => setEditing(true)}>
              <PencilIcon /> Change Password
            </HighlightedButton>
          </>
        )}
      </div>
    </form>
  );
}
