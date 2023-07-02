import { RadioGroup } from '@headlessui/react';
import { classNames } from '@/utils/class-names';
import { Price } from '@/components/products/price';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  ActiveCustomerAddressesQuery,
  CurrencyCode,
  EligibleShippingMethodsQuery,
} from '@/graphql-types.generated';

export type SelectedAddress = NonNullable<
  NonNullable<ActiveCustomerAddressesQuery['activeCustomer']>['addresses']
>[number];

export function ShippingAddressSelector({
  addresses,
  selectedAddressIndex,
  onChange,
}: {
  addresses: SelectedAddress[];
  selectedAddressIndex: number;
  onChange: (value: number) => void;
}) {
  return (
    <RadioGroup value={selectedAddressIndex} onChange={onChange}>
      <div>
        {(addresses || []).map((address, index) => (
          <RadioGroup.Option
            key={index}
            value={index}
            className={({ checked, active }) =>
              `${checked ?? 'oi'} ${active ?? 'po'}`
            }
          >
            {({ checked, active }) => (
              <>
                <span>
                  <span>
                    <RadioGroup.Label as="span">
                      {address.streetLine1}, {address.postalCode}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="span">
                      <ul>
                        <li>{address.streetLine1}</li>
                        <li>{address.streetLine2}</li>
                        <li>{address.city}</li>
                        <li>{address.province}</li>
                        <li>{address.postalCode}</li>
                        <li>{address.country.name}</li>
                      </ul>
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
