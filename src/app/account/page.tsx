'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import Button, { ButtonTray } from '@/components/button';
import Modal from '@/components/modal/modal';

import useToggleState from '@/utils/use-toggle-state';
import {
  useRequestUpdateCustomerEmailAddressMutation,
  useUpdateCustomerMutation,
} from '@/graphql-types.generated';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/form/input';
import { ActiveCustomerContext } from '@/lib/active-customer-wrapper';
import Field from '@/components/form/field';
import Message from '@/components/message';
import styles from '@/styles/pages/account.module.css';

// enum FormIntent {
//   UpdateEmail = 'updateEmail',
//   UpdateDetails = 'updateDetails',
// }

export const validator = z.object({
  title: z.string(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phoneNumber: z.string(),
});

// const changeEmailValidator = z.object({
//   email: z
//     .string()
//     .min(1, { message: 'Email is required' })
//     .email('Must be a valid email'),
//   password: z.string().min(1, { message: 'Password is required' }),
// });

type EmailSavedResponse = {
  newEmailAddress: string;
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
  const { activeCustomer } = useContext(ActiveCustomerContext);

  const [
    requestUpdateCustomerEmailAddress,
    {
      loading: loadingUpdateEmail,
      error: requestUpdateCustomerEmailAddressError,
    },
  ] = useRequestUpdateCustomerEmailAddressMutation();
  const [
    updateCustomer,
    { error: updateCustomerError, loading: loadingUpdateCustomer },
  ] = useUpdateCustomerMutation();

  const {
    register: registerEmail,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const {
    register: registerUpdateDetails,
    handleSubmit: handleSubmitUpdateDetails,
    formState: { errors: updateDetailsErrors },
  } = useForm<UpdateDetailsFormFields>({
    defaultValues: {
      title: activeCustomer?.title || '',
      firstName: activeCustomer?.firstName || '',
      lastName: activeCustomer?.lastName || '',
      phoneNumber: activeCustomer?.phoneNumber || '',
    },
  });

  const { firstName, lastName, title, phoneNumber, emailAddress } =
    activeCustomer || {};
  const fullName = `${title ? title + ' ' : ''}${firstName} ${lastName}`;

  const [emailSavedResponse] = useState<EmailSavedResponse>();
  const [showChangeEmailModal, openChangeEmailModal, closeChangeEmailModal] =
    useToggleState(false);
  const [isEditing, setIsEditing] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const updateEmail = async ({ password, email }: FormFields) => {
    requestUpdateCustomerEmailAddress({
      variables: {
        password,
        newEmailAddress: email,
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
        input: {
          title,
          firstName,
          lastName,
          phoneNumber,
        },
      },
    });
  };

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    formRef.current?.reset();
  }, [isEditing]);

  if (!activeCustomer) {
    router.push('/sign-in');

    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Change email modal */}
      <Modal
        isOpen={showChangeEmailModal}
        close={() => closeChangeEmailModal()}
        size="small"
      >
        <h2>Change Email Address</h2>

        <form onSubmit={handleSubmit(updateEmail)}>
          <div>
            <p>We will send a verification email to your new email address.</p>
            <p>
              Your current email address: <strong>{emailAddress}</strong>
            </p>

            <Field
              label="New Email Address"
              htmlFor="account-details__new-email"
              errorMessage={errors.email?.message}
            >
              <Input
                id="account-details__new-email"
                type="email"
                // autoFocus
                {...registerEmail('email', { required: true })}
                stretched
              />
            </Field>
            <Field
              label="Password"
              htmlFor="account-details__password"
              errorMessage={errors.password?.message}
            >
              <Input
                id="account-details__password"
                type="password"
                {...registerEmail('password', { required: true })}
                stretched
              />
            </Field>

            {requestUpdateCustomerEmailAddressError && (
              <Message
                type="error"
                headingText="We ran into a problem changing your email"
                text={requestUpdateCustomerEmailAddressError.message}
              />
            )}
          </div>
          <ButtonTray>
            <Button
              type="reset"
              onClick={() => closeChangeEmailModal()}
              role="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loadingUpdateEmail}>
              Save
            </Button>
          </ButtonTray>
        </form>
      </Modal>

      {/* Email */}
      <div className={styles.details}>
        <div>
          <h3>Email</h3>
          {emailSavedResponse ? (
            <p>
              <span>{emailSavedResponse.newEmailAddress}</span> -{' '}
              <span>Awaiting confirmation</span>
            </p>
          ) : (
            <p>{emailAddress}</p>
          )}
        </div>
      </div>

      <div className={styles.details}>
        <Button
          type="button"
          onClick={() => openChangeEmailModal()}
          icon={<PencilIcon width={20} height={20} />}
          iconPosition="right"
        >
          Change Email
        </Button>
      </div>

      {/* Name and Phone */}
      <form onSubmit={handleSubmitUpdateDetails(updateDetails)}>
        {isEditing ? (
          <>
            <Field
              label="Title"
              htmlFor="account-details__title"
              errorMessage={updateDetailsErrors.title?.message}
            >
              <Input
                type="text"
                {...registerUpdateDetails('title')}
                stretched
              />
            </Field>
            <Field
              label="First Name"
              htmlFor="account-details__first-name"
              errorMessage={updateDetailsErrors.firstName?.message}
            >
              <Input
                id="account-details__first-name"
                type="text"
                {...registerUpdateDetails('firstName', {
                  required: true,
                })}
                stretched
              />
            </Field>
            <Field
              label="Last Name"
              htmlFor="account-details__last-name"
              errorMessage={updateDetailsErrors.lastName?.message}
            >
              <Input
                type="text"
                id="account-details__last-name"
                {...registerUpdateDetails('lastName', { required: true })}
                stretched
              />
            </Field>
            <Field
              label="Phone"
              htmlFor="account-details__phone"
              errorMessage={updateDetailsErrors.phoneNumber?.message}
            >
              <Input
                type="text"
                id="account-details__phone"
                {...registerUpdateDetails('phoneNumber')}
                stretched
              />
            </Field>
          </>
        ) : (
          <div className={styles.details}>
            <Field>
              <h3>Full Name</h3>
              <p>{fullName}</p>
            </Field>
            <Field>
              <h3>Phone</h3>
              <p>{phoneNumber}</p>
            </Field>
          </div>
        )}

        <div>
          {isEditing ? (
            <>
              {updateCustomerError && (
                <Message
                  headingText="We ran into a problem updating your details!"
                  text={updateCustomerError.message}
                />
              )}

              <ButtonTray>
                <Button
                  type="submit"
                  disabled={loadingUpdateCustomer}
                  icon={<CheckIcon width={20} height={20} />}
                >
                  Save
                </Button>

                <Button
                  type="reset"
                  onClick={() => setIsEditing(false)}
                  icon={<XMarkIcon width={20} height={20} />}
                  role="secondary"
                >
                  Cancel
                </Button>
              </ButtonTray>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              icon={<PencilIcon width={20} height={20} />}
              iconPosition="right"
            >
              Edit
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default AccountDetails;
