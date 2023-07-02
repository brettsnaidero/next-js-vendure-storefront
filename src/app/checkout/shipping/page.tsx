'use client';

import { FormEvent, useContext, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import {
  AvailableCountriesQuery,
  EligibleShippingMethodsQuery,
} from '@/providers/checkout/checkout';
import { shippingFormDataIsValid } from '@/utils/validation';
import { classNames } from '@/utils/class-names';
import { ActiveCustomerAddressesQuery } from '@/providers/customer/customer';
import { AddressForm } from '@/components/account/address-form';
import { ShippingMethodSelector } from '@/components/checkout/shipping-method-selector';
import { ShippingAddressSelector } from '@/components/checkout/shipping-address-selector';
import { useSuspenseQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import {
  ActiveCustomerAddressesQuery as ActiveCustomerAddressesQueryType,
  AvailableCountriesQuery as AvailableCountriesQueryType,
  EligibleShippingMethodsQuery as EligibleShippingMethodsQueryType,
} from '@/graphql-types.generated';
import { ActiveOrderContext } from '@/lib/active-order-wrapper';

const CheckoutShipping = () => {
  const router = useRouter();
  const { activeOrderFetcher, activeOrder } = useContext(ActiveOrderContext);
  const { customer, shippingAddress } = activeOrder ?? {};

  const [customerFormChanged, setCustomerFormChanged] = useState(false);
  const [addressFormChanged, setAddressFormChanged] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const { data: dataAvailableCountries } =
    useSuspenseQuery<AvailableCountriesQueryType>(AvailableCountriesQuery);
  const { data: dataEligibleShippingMethods } =
    useSuspenseQuery<EligibleShippingMethodsQueryType>(
      EligibleShippingMethodsQuery,
    );
  const { data: dataActiveCustomerAddresses } =
    useSuspenseQuery<ActiveCustomerAddressesQueryType>(
      ActiveCustomerAddressesQuery,
    );

  const isSignedIn = !!dataActiveCustomerAddresses?.activeCustomer?.id;
  const defaultFullName =
    shippingAddress?.fullName ??
    (customer ? `${customer.firstName} ${customer.lastName}` : ``);
  const canProceedToPayment =
    customer &&
    ((shippingAddress?.streetLine1 && shippingAddress?.postalCode) ||
      selectedAddressIndex != null) &&
    activeOrder?.shippingLines?.length &&
    activeOrder?.lines?.length;

  // Check if there is an active order, if not redirect to homepage
  // if (
  //   !session ||
  //   !activeOrder ||
  //   !activeOrder.active ||
  //   activeOrder.lines.length === 0
  // ) {
  //   return router.push('/');
  // }

  const submitCustomerForm = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const { emailAddress, firstName, lastName } = Object.fromEntries<any>(
      formData.entries(),
    );
    const isValid = event.currentTarget.checkValidity();

    if (
      customerFormChanged &&
      isValid &&
      emailAddress &&
      firstName &&
      lastName
    ) {
      // activeOrderFetcher.submit(formData, {
      //   method: 'post',
      //   action: '/api/active-order',
      // });

      setCustomerFormChanged(false);
    }
  };

  const submitAddressForm = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const isValid = event.currentTarget.checkValidity();

    if (addressFormChanged && isValid) {
      setShippingAddress(formData);
    }
  };

  const submitSelectedAddress = (index: number) => {
    const selectedAddress =
      dataActiveCustomerAddresses?.activeCustomer?.addresses?.[index];

    if (selectedAddress) {
      setSelectedAddressIndex(index);

      const formData = new FormData();
      Object.keys(selectedAddress).forEach((key) =>
        formData.append(key, (selectedAddress as any)[key]),
      );
      formData.append('countryCode', selectedAddress.country.code);
      formData.append('action', 'setCheckoutShipping');

      setShippingAddress(formData);
    }
  };

  const setShippingAddress = (formData: FormData) => {
    if (shippingFormDataIsValid(formData)) {
      // activeOrderFetcher.submit(formData, {
      //   method: 'post',
      //   action: '/api/active-order',
      // });

      setAddressFormChanged(false);
    }
  };

  const submitSelectedShippingMethod = (value?: string) => {
    if (value) {
      // activeOrderFetcher.submit(
      //   {
      //     action: 'setShippingMethod',
      //     shippingMethodId: value,
      //   },
      //   {
      //     method: 'post',
      //     action: '/api/active-order',
      //   },
      // );
    }
  };

  const navigateToPayment = () => {
    router.push('/payment');
  };

  return (
    <div>
      <div>
        <h2>Contact information</h2>

        {isSignedIn ? (
          <div>
            <p>
              {customer?.firstName} {customer?.lastName}
            </p>
            <p>{customer?.emailAddress}</p>
          </div>
        ) : (
          <form
            onSubmit={submitCustomerForm}
            onChange={() => setCustomerFormChanged(true)}
            hidden={isSignedIn}
          >
            <div>
              <label htmlFor="emailAddress">Email address</label>
              <div>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  autoComplete="email"
                  defaultValue={customer?.emailAddress}
                />
              </div>
              {/* error?.errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR' && (
                <p>{error.message}</p>
              ) */}
            </div>
            <div>
              <div>
                <label htmlFor="firstName">First name</label>
                <div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    defaultValue={customer?.firstName}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName">Last name</label>
                <div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    defaultValue={customer?.lastName}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <form
        method="post"
        action="/api/active-order"
        onBlur={submitAddressForm}
        onChange={() => setAddressFormChanged(true)}
      >
        <input type="hidden" name="action" value="setCheckoutShipping" />
        <div>
          <h2>Shipping information</h2>
        </div>
        {isSignedIn &&
        dataActiveCustomerAddresses?.activeCustomer?.addresses?.length ? (
          <div>
            <ShippingAddressSelector
              addresses={dataActiveCustomerAddresses?.activeCustomer?.addresses}
              selectedAddressIndex={selectedAddressIndex}
              onChange={submitSelectedAddress}
            />
          </div>
        ) : (
          <AddressForm
            availableCountries={
              activeOrder
                ? dataAvailableCountries?.availableCountries
                : undefined
            }
            address={shippingAddress}
            defaultFullName={defaultFullName}
          ></AddressForm>
        )}
      </form>

      <div>
        <ShippingMethodSelector
          eligibleShippingMethods={
            dataEligibleShippingMethods?.eligibleShippingMethods
          }
          currencyCode={activeOrder?.currencyCode}
          shippingMethodId={
            activeOrder?.shippingLines[0]?.shippingMethod.id ?? ''
          }
          onChange={submitSelectedShippingMethod}
        />
      </div>

      <button
        type="button"
        disabled={!canProceedToPayment}
        onClick={navigateToPayment}
        className={classNames(
          canProceedToPayment
            ? 'bg-primary-600 hover:bg-primary-700'
            : 'bg-gray-400',
        )}
      >
        <LockClosedIcon></LockClosedIcon>
        <span>Proceed to payment</span>
      </button>
    </div>
  );
};

export default CheckoutShipping;
