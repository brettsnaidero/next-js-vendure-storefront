import React from 'react';
import Price from '@/components/products/price';
import {
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '@/graphql-types.generated';
import Radio, { RadioGroup } from '@/components/form/radio';
import styles from '@/styles/pages/checkout.module.css';

const ShippingMethodSelector = ({
  eligibleShippingMethods,
  currencyCode,
  shippingMethodId,
  onChange,
}: {
  eligibleShippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
  shippingMethodId: string | undefined;
  onChange: (shippingMethodId: string) => void;
  currencyCode?: CurrencyCode;
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <RadioGroup>
      {eligibleShippingMethods.map((shippingMethod) => (
        <Radio
          name="shipping-method__radio"
          id={`shipping-method__radio--${shippingMethod.id}`}
          key={shippingMethod.id}
          value={shippingMethod.id}
          onChange={handleChange}
          checked={shippingMethodId === shippingMethod.id}
        >
          <label
            htmlFor={`shipping-method__radio--${shippingMethod.id}`}
            className={styles.label}
          >
            <div>{shippingMethod.name}</div>
            <Price
              priceWithTax={shippingMethod.priceWithTax}
              currencyCode={currencyCode}
            />
          </label>
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default ShippingMethodSelector;
