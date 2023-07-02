import { RadioGroup } from '@headlessui/react';
import { classNames } from '@/utils/class-names';
import { Price } from '@/components/products/price';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import {
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '@/graphql-types.generated';

export function ShippingMethodSelector({
  eligibleShippingMethods,
  currencyCode,
  shippingMethodId,
  onChange,
}: {
  eligibleShippingMethods: EligibleShippingMethodsQuery['eligibleShippingMethods'];
  shippingMethodId: string | undefined;
  onChange: (value?: string) => void;
  currencyCode?: CurrencyCode;
}) {
  return (
    <RadioGroup value={shippingMethodId} onChange={onChange}>
      <RadioGroup.Label>Delivery method</RadioGroup.Label>

      <div>
        {eligibleShippingMethods.map((shippingMethod) => (
          <RadioGroup.Option
            key={shippingMethod.id}
            value={shippingMethod.id}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-transparent' : 'border-gray-300',
                active ? 'ring-2 ring-primary-500' : '',
                'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none',
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span>
                  <span>
                    <RadioGroup.Label as="span">
                      {shippingMethod.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span">
                      <Price
                        priceWithTax={shippingMethod.priceWithTax}
                        currencyCode={currencyCode}
                      ></Price>
                    </RadioGroup.Description>
                  </span>
                </span>
                {checked ? <CheckCircleIcon aria-hidden="true" /> : null}
                <span
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-primary-500' : 'border-transparent',
                    'absolute -inset-px rounded-lg pointer-events-none',
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
