import React from 'react';
import { ActiveCustomerQuery } from '@/graphql-types.generated';
import Radio, { RadioGroup } from '../form/radio';

export type SelectedAddress = NonNullable<
  NonNullable<ActiveCustomerQuery['activeCustomer']>['addresses']
>[number];

const ShippingAddressSelector = ({
  addresses,
  selectedAddressIndex,
  onChange,
}: {
  addresses: SelectedAddress[];
  selectedAddressIndex?: number;
  onChange: (value: string) => void;
}) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      onChange(event.target.value);
    }
  };

  return (
    <RadioGroup>
      {addresses.map((address, index) => {
        const id = `shipping-address-${index}`;
        return (
          <Radio
            key={index}
            value={index}
            onChange={handleChange}
            name="shipping-address-selection"
            checked={selectedAddressIndex === index}
            id={id}
          >
            <label htmlFor={id}>
              <ul>
                <li>{address.streetLine1}</li>
                <li>{address.streetLine2}</li>
                <li>
                  {address.city}, {address.province} {address.postalCode}
                </li>
                <li>{address.country.name}</li>
              </ul>
            </label>
          </Radio>
        );
      })}
    </RadioGroup>
  );
};

export default ShippingAddressSelector;
