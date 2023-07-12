'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';

import { LockClosedIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
  AvailableCountriesQuery,
  EligibleShippingMethodsQuery,
} from '@/providers/checkout/checkout';
import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import AddressForm, { ShippingForm } from '@/components/account/address-form';
import ShippingMethodSelector from '@/components/checkout/shipping-method-selector';
import ShippingAddressSelector from '@/components/checkout/shipping-address-selector';
import {
  ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType,
  AvailableCountriesQuery as AvailableCountriesQueryType,
  EligibleShippingMethodsQuery as EligibleShippingMethodsQueryType,
  useCreateCustomerAddressMutation,
} from '@/graphql-types.generated';
import { classNames } from '@/utils/class-names';
import { useActiveOrder } from '@/utils/use-active-order';
import Button from '@/components/button';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import Message from '@/components/message';
import Modal from '@/components/modal/modal';
import CustomerAddressForm, {
  CustomerAddressFormFields,
} from '@/components/account/customer-address-form';
import styles from '@/styles/pages/checkout.module.css';
import LoadingPage from '@/components/loading';

interface CustomerForm {
  email: string;
  firstName: string;
  lastName: string;
}

const CheckoutShipping = () => {
  const router = useRouter();
  const {
    activeOrder,
    setOrderCustomer,
    setShippingMethod,
    setCheckoutShipping,
    error,
  } = useActiveOrder();

  const [customerFormChanged, setCustomerFormChanged] = useState(false);
  const [addressFormChanged, setAddressFormChanged] = useState(false);
  const [newAddress, setNewAddress] = useState(false);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // TODO: Can this be one query?
  const { data: dataAvailableCountries } =
    useSuspenseQuery<AvailableCountriesQueryType>(AvailableCountriesQuery);
  const { data: dataEligibleShippingMethods } =
    useSuspenseQuery<EligibleShippingMethodsQueryType>(
      EligibleShippingMethodsQuery,
    );
  const { data: dataActiveCustomerAddresses, refetch } =
    useSuspenseQuery<ActiveCustomerAddressesQueryType>(
      ActiveCustomerAddressesQuery,
    );
  const [createCustomerAddress] = useCreateCustomerAddressMutation();

  // Customer information form
  const {
    register: registerCustomerForm,
    handleSubmit: handleSubmitCustomerForm,
    formState: { errors: customerFormErrors, isValid },
  } = useForm<CustomerForm>({
    defaultValues: {
      email: activeOrder?.customer?.emailAddress,
      firstName: activeOrder?.customer?.firstName,
      lastName: activeOrder?.customer?.lastName,
    },
  });

  const isSignedIn = !!dataActiveCustomerAddresses?.activeCustomer?.id;

  const defaultFullName =
    activeOrder?.shippingAddress?.fullName ??
    (activeOrder?.customer
      ? `${activeOrder?.customer.firstName} ${activeOrder?.customer.lastName}`
      : ``);

  const hasAddress = isSignedIn
    ? selectedAddressIndex !== null
    : !!(
        activeOrder?.shippingAddress?.streetLine1 &&
        activeOrder?.shippingAddress?.postalCode
      );

  const canProceedToPayment =
    !!activeOrder?.customer &&
    hasAddress &&
    activeOrder?.shippingLines?.length &&
    activeOrder?.lines?.length;

  // If there is no active order, redirect to the home page
  if (
    // !session ||
    !activeOrder ||
    !activeOrder.active ||
    activeOrder.lines.length === 0
  ) {
    router.push('/');

    return <LoadingPage />;
  }

  // Customer information form handlers
  const submitCustomerForm = ({
    email: emailAddress,
    firstName,
    lastName,
  }: CustomerForm) => {
    // TODO: Seems to be failing with "ALREADY_LOGGED_IN_ERROR"
    if (
      customerFormChanged &&
      isValid &&
      emailAddress &&
      firstName &&
      lastName
    ) {
      setOrderCustomer?.({
        emailAddress,
        firstName,
        lastName,
      });

      setCustomerFormChanged(false);
    }
  };

  // Shipping information form handlers
  const changeShippingMethod = (shippingMethodId: string) => {
    setShippingMethod?.(shippingMethodId);
  };

  const changeSelectedAddress = (index: number) => {
    const selectedAddress =
      dataActiveCustomerAddresses?.activeCustomer?.addresses?.[index];

    if (selectedAddress) {
      setSelectedAddressIndex(index);

      setCheckoutShipping?.({
        city: selectedAddress.city ?? undefined,
        company: selectedAddress.company ?? undefined,
        countryCode: selectedAddress.country.code,
        fullName: selectedAddress.fullName ?? undefined,
        phoneNumber: selectedAddress.phoneNumber ?? undefined,
        postalCode: selectedAddress.postalCode ?? undefined,
        province: selectedAddress.province ?? undefined,
        streetLine1: selectedAddress.streetLine1,
        streetLine2: selectedAddress.streetLine2 ?? undefined,
        // customFields: selectedAddress.defaultShippingAddress,
      });
    }
  };

  const changeAddress = (address: ShippingForm) => {
    if (addressFormChanged) {
      setCheckoutShipping?.({
        city: address.city,
        company: address.company,
        countryCode: address.country,
        fullName: address.fullName,
        phoneNumber: address.phone,
        postalCode: address.postalCode,
        province: address.state,
        streetLine1: address.addressLine1,
        streetLine2: address.addressLine2,
        // customFields: '',
      });

      setCustomerFormChanged(false);
    }
  };

  const submitNewAddress = (address: CustomerAddressFormFields) => {
    createCustomerAddress({
      variables: {
        input: {
          city: address.city,
          company: address.company,
          countryCode: address.countryCode,
          fullName: address.fullName,
          phoneNumber: address.phone,
          postalCode: address.postalCode,
          province: address.province,
          streetLine1: address.streetLine1,
          streetLine2: address.streetLine2,
        },
      },
    }).then(({ data }) => {
      if (data?.createCustomerAddress?.__typename === 'Address') {
        setNewAddress(false);
      }

      // Refetch the customer addresses now
      refetch();
    });
  };

  const navigateToPayment = () => {
    router.push('/checkout/payment');
  };

  return (
    <div>
      <div className={styles.information}>
        <h3>Contact information</h3>

        {/* Customer information form */}
        {isSignedIn ? (
          <div className={styles.customer}>
            <p>
              {activeOrder?.customer?.firstName}{' '}
              {activeOrder?.customer?.lastName}
            </p>
            <p>{activeOrder?.customer?.emailAddress}</p>
          </div>
        ) : (
          <form
            onBlur={handleSubmitCustomerForm(submitCustomerForm)}
            onChange={() => setCustomerFormChanged(true)}
          >
            <Field
              label="Email address"
              htmlFor="customer-information__email"
              errorMessage={customerFormErrors.email?.message}
            >
              <Input
                type="email"
                id="customer-information__email"
                autoComplete="email"
                {...registerCustomerForm('email', { required: true })}
              />
            </Field>

            <Field
              label="First name"
              htmlFor="customer-information__first-name"
              errorMessage={customerFormErrors.firstName?.message}
            >
              <Input
                type="text"
                id="customer-information__first-name"
                autoComplete="given-name"
                {...registerCustomerForm('firstName', { required: true })}
                stretched
              />
            </Field>
            <Field
              label="Last name"
              htmlFor="customer-information__last-name"
              errorMessage={customerFormErrors.lastName?.message}
            >
              <Input
                type="text"
                id="customer-information__last-name"
                autoComplete="family-name"
                {...registerCustomerForm('lastName', { required: true })}
                stretched
              />
            </Field>

            {error?.errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR' && (
              <Message type="error" text={error.message} />
            )}
            {error?.errorCode === 'ALREADY_LOGGED_IN_ERROR' && (
              <Message type="error" text={error.message} />
            )}
          </form>
        )}
      </div>

      <div className={styles.information}>
        <h3>Shipping information</h3>

        {/* Shipping address selector or form */}
        {isSignedIn &&
        dataActiveCustomerAddresses?.activeCustomer?.addresses?.length ? (
          <div>
            <ShippingAddressSelector
              addresses={dataActiveCustomerAddresses?.activeCustomer?.addresses}
              selectedAddressIndex={selectedAddressIndex}
              onChange={changeSelectedAddress}
            />

            {/* Add new address */}
            <div className={styles.add}>
              <Button
                type="button"
                size="small"
                onClick={() => setNewAddress(true)}
                role="secondary"
                icon={<PlusIcon width={20} height={20} />}
              >
                Add new address
              </Button>
              <Modal isOpen={newAddress} close={() => setNewAddress(false)}>
                <h2>Add new address</h2>

                <CustomerAddressForm
                  availableCountries={
                    dataAvailableCountries?.availableCountries
                  }
                  submit={submitNewAddress}
                >
                  <Button
                    type="button"
                    onClick={() => setNewAddress(false)}
                    role="secondary"
                  >
                    Cancel
                  </Button>
                </CustomerAddressForm>
              </Modal>
            </div>
          </div>
        ) : (
          <AddressForm
            availableCountries={dataAvailableCountries?.availableCountries}
            address={activeOrder?.shippingAddress}
            defaultFullName={defaultFullName}
            onChange={changeAddress}
            setAddressFormChanged={setAddressFormChanged}
          />
        )}
      </div>

      {/* Shipping method selector */}
      <div className={styles.information}>
        <h3>Delivery method</h3>

        <ShippingMethodSelector
          eligibleShippingMethods={
            dataEligibleShippingMethods?.eligibleShippingMethods
          }
          currencyCode={activeOrder?.currencyCode}
          shippingMethodId={
            activeOrder?.shippingLines[0]?.shippingMethod.id ?? ''
          }
          onChange={changeShippingMethod}
        />
      </div>

      <Button
        type="button"
        disabled={!canProceedToPayment}
        className={classNames(canProceedToPayment ? 'able' : '')}
        onClick={navigateToPayment}
        icon={<LockClosedIcon width={20} height={20} />}
        iconPosition="right"
        size="large"
      >
        Proceed to payment
      </Button>
    </div>
  );
};

export default CheckoutShipping;
