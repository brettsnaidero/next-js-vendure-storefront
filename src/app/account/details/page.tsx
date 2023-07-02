'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { Button } from '@/components/button';
import { ErrorMessage } from '@/components/error-message';
import { HighlightedButton } from '@/components/highlighted-button';
import { Input } from '@/components/input';
import Modal from '@/components/modal/modal';
import {
  RequestUpdateCustomerEmailAddressMutation,
  UpdateCustomerMutation,
} from '@/providers/account/account';
import { ActiveCustomerDetailsQuery } from '@/providers/customer/customer';

import useToggleState from '@/utils/use-toggle-state';
import { replaceEmptyString } from '@/utils/validation';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import {
  ActiveCustomerDetailsQuery as ActiveCustomerDetailsQueryType,
  RequestUpdateCustomerEmailAddressMutation as RequestUpdateCustomerEmailAddressMutationType,
  UpdateCustomerMutation as UpdateCustomerMutationType,
} from '@/graphql-types.generated';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

enum FormIntent {
  UpdateEmail = 'updateEmail',
  UpdateDetails = 'updateDetails',
}

export const validator = z.object({
  title: z.string(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phoneNumber: z.string(),
});

const changeEmailValidator = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('Must be a valid email'),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormError = {
  message: string;
  intent?: string;
};

type EmailSavedResponse = {
  newEmailAddress: string;
};

type CustomerUpdatedResponse = {
  customerUpdated: true;
};

interface FormFields {
  password: string;
  email: string;
}

interface UpdateDetailsFormFields {
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const AccountDetails = () => {
  const router = useRouter();
  const { data: activeCustomerData } =
    useSuspenseQuery<ActiveCustomerDetailsQueryType>(
      ActiveCustomerDetailsQuery,
    );
  const [
    requestUpdateCustomerEmailAddress,
    { error: requestUpdateCustomerEmailAddressError },
  ] = useMutation<RequestUpdateCustomerEmailAddressMutationType>(
    RequestUpdateCustomerEmailAddressMutation,
  );
  const [updateCustomer, { error: updateCustomerError }] =
    useMutation<UpdateCustomerMutationType>(UpdateCustomerMutation);

  const { activeCustomer } = activeCustomerData || {};

  // TODO: Register these forms
  const {
    register: registerEmail,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormFields>();

  const {
    register: registerUpdateDetails,
    handleSubmit: handleSubmitUpdateDetails,
    // formState: { errors },
  } = useForm<UpdateDetailsFormFields>();

  const updateEmail = async ({ password, email }: FormFields) => {
    requestUpdateCustomerEmailAddress({
      variables: {
        password,
        email,
      },
    });
  };

  const updateDetails = async ({
    title,
    firstName,
    lastName,
    phoneNumber,
  }: UpdateDetailsFormFields) => {
    updateCustomer({
      variables: {
        title,
        firstName,
        lastName,
        phoneNumber,
      },
    });
  };

  const { firstName, lastName, title, phoneNumber, emailAddress } =
    activeCustomer || {};
  const fullName = `${title ? title + ' ' : ''}${firstName} ${lastName}`;

  const [emailSavedResponse, setEmailSavedResponse] =
    useState<EmailSavedResponse>();
  const [showChangeEmailModal, openChangeEmailModal, closeChangeEmailModal] =
    useToggleState(false);
  const [isEditing, setIsEditing] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // if (!actionDataHook) {
    //   return;
    // }
    // if (isEmailSavedResponse(actionDataHook)) {
    //   setEmailSavedResponse(actionDataHook);
    //   closeChangeEmailModal();
    //   return;
    // }
    // if (isCustomerUpdatedResponse(actionDataHook)) {
    //   setIsEditing(false);
    //   setFormError(undefined);
    //   return;
    // }
    // if (isFormError(actionDataHook)) {
    //   setFormError(actionDataHook);
    //   return;
    // }
  }, []);

  useEffect(() => {
    formRef.current?.reset();
  }, [isEditing]);

  if (!activeCustomer) {
    return router.push('/sign-in');
  }

  const state = 'submitting'; // TODO!

  return (
    <>
      <Modal
        isOpen={showChangeEmailModal}
        close={() => closeChangeEmailModal()}
        afterOpen={() => emailInputRef.current?.focus()}
        size="small"
      >
        <form onSubmit={handleSubmit(updateEmail)}>
          <Modal.Title>Change Email Address</Modal.Title>
          <Modal.Body>
            <div>
              <p>
                We will send a verification email to your new email address.
              </p>
              <p>
                Your current email address: <strong>{emailAddress}</strong>
              </p>

              <div>
                <Input
                  ref={emailInputRef}
                  autoFocus
                  label="New Email Address"
                  name="email"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  required
                />
                <input type="submit" hidden />
              </div>

              {requestUpdateCustomerEmailAddressError && (
                <ErrorMessage
                  heading="We ran into a problem changing your E-Mail!"
                  message={requestUpdateCustomerEmailAddressError.message}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="reset" onClick={() => closeChangeEmailModal()}>
              Cancel
            </Button>
            <HighlightedButton
              type="submit"
              isSubmitting={state === 'submitting'}
            >
              Save
            </HighlightedButton>
          </Modal.Footer>
        </form>
      </Modal>

      <div>
        <div>
          <div>
            <h3>E-Mail</h3>
            {emailSavedResponse ? (
              <span>
                <span>{emailSavedResponse.newEmailAddress}</span>
                <span>awaiting confirmation</span>
              </span>
            ) : (
              <span>{emailAddress}</span>
            )}
          </div>
          <div>
            <HighlightedButton
              type="button"
              onClick={() => openChangeEmailModal()}
            >
              <PencilIcon /> Change Email
            </HighlightedButton>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmitUpdateDetails(updateDetails)}>
            <div>
              {isEditing && (
                <div>
                  <Input label="Title" name="title" />
                </div>
              )}
              {isEditing ? (
                <>
                  <div>
                    <Input label="First Name" name="firstName" required />
                  </div>
                  <div>
                    <Input label="Last Name" name="lastName" required />
                  </div>
                </>
              ) : (
                <div>
                  <h3>Full Name</h3>
                  {replaceEmptyString(fullName)}
                </div>
              )}

              <div>
                {isEditing ? (
                  <Input label="Phone Nr." name="phoneNumber" />
                ) : (
                  <div>
                    <h3>Phone Nr.</h3>
                    {replaceEmptyString(phoneNumber)}
                  </div>
                )}
              </div>
              <div>
                {isEditing ? (
                  <>
                    {updateCustomerError && (
                      <ErrorMessage
                        heading="We ran into a problem updating your details!"
                        message={updateCustomerError.message}
                      />
                    )}

                    <div>
                      <HighlightedButton
                        type="submit"
                        isSubmitting={state === 'submitting'}
                      >
                        <CheckIcon /> Save
                      </HighlightedButton>

                      <Button type="reset" onClick={() => setIsEditing(false)}>
                        <XMarkIcon /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <HighlightedButton
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon /> Edit
                  </HighlightedButton>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
