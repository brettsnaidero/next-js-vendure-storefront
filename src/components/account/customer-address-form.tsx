import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from '@/components/form/select';
import {
  ActiveCustomerAddressesQuery,
  AvailableCountriesQuery,
} from '@/graphql-types.generated';
import { useForm } from 'react-hook-form';
import Button, { ButtonTray } from '@/components/button';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import styles from '@/styles/components/address-form.module.css';

export const validator = z.object({
  fullName: z.string().min(1, { message: 'Name is required' }),
  city: z.string(),
  countryCode: z.string().min(1, { message: 'Country is required' }),
  postalCode: z.string(),
  province: z.string(),
  streetLine1: z.string().min(1, { message: 'Address is required' }),
  streetLine2: z.string(),
  phone: z.string(),
  company: z.string(),
});

export interface CustomerAddressFormFields {
  fullName: string;
  city: string;
  streetLine1: string;
  streetLine2: string;
  countryCode: string;
  postalCode: string;
  phone: string;
  company: string;
  province: string;
}

// Utility to lookup optional array types
type Unpacked<T> = T extends (infer U)[] ? U : T;

const CustomerAddressForm = ({
  address,
  submit,
  availableCountries,
  children,
}: {
  address?: Unpacked<
    Extract<
      ActiveCustomerAddressesQuery['activeCustomer'],
      { __typename?: 'Customer' }
    >['addresses']
  >;
  submit: (data: CustomerAddressFormFields) => void;
  availableCountries: AvailableCountriesQuery['availableCountries'];
  children?: React.ReactNode;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<CustomerAddressFormFields>({
    resolver: zodResolver(validator),
    defaultValues: {
      fullName: address?.fullName || undefined,
      city: address?.city || undefined,
      streetLine1: address?.streetLine1 || undefined,
      streetLine2: address?.streetLine2 || undefined,
      countryCode: address?.country?.code || undefined,
      postalCode: address?.postalCode || undefined,
      phone: address?.phoneNumber || undefined,
      company: address?.company || undefined,
      province: address?.province || undefined,
    },
  });

  return (
    <form id="edit-address-form" onSubmit={handleSubmit(submit)}>
      <Field
        label="Full name"
        htmlFor="edit-address-form__full-name"
        errorMessage={errors.fullName?.message}
        required
      >
        <Input
          type="text"
          id="edit-address-form__full-name"
          autoComplete="full-name"
          {...register('fullName', { required: true })}
          stretched
        />
      </Field>

      <Field
        label="Company"
        htmlFor="edit-address-form__company"
        errorMessage={errors.company?.message}
      >
        <Input
          type="text"
          id="edit-address-form__company"
          {...register('company')}
          stretched
        />
      </Field>

      <div className={styles.form}>
        <Field
          label="Address"
          htmlFor="edit-address-form__address-line1"
          errorMessage={errors.streetLine1?.message}
          required
        >
          <Input
            type="text"
            id="edit-address-form__address-line1"
            autoComplete="address-line1"
            {...register('streetLine1', { required: true })}
            stretched
          />
        </Field>

        <Field
          label="Apartment, suite, etc."
          htmlFor="edit-address-form__address-line2"
          errorMessage={errors.streetLine2?.message}
        >
          <Input
            type="text"
            id="edit-address-form__address-line2"
            autoComplete="address-line2"
            {...register('streetLine2')}
            stretched
          />
        </Field>

        <Field
          label="Postal code"
          htmlFor="edit-address-form__postal-code"
          errorMessage={errors.postalCode?.message}
          required
        >
          <Input
            type="text"
            id="edit-address-form__postal-code"
            autoComplete="postal-code"
            {...register('postalCode', { required: true })}
            stretched
          />
        </Field>

        <Field
          label="City"
          htmlFor="edit-address-form__city"
          errorMessage={errors.city?.message}
          required
        >
          <Input
            type="text"
            id="edit-address-form__city"
            autoComplete="locality"
            {...register('city', { required: true })}
            stretched
          />
        </Field>

        <Field
          label="Province / State"
          htmlFor="edit-address-form__province"
          errorMessage={errors.province?.message}
        >
          <Input
            type="text"
            id="edit-address-form__province"
            autoComplete="address-level1"
            {...register('province')}
            stretched
          />
        </Field>

        <Field
          label="Country"
          htmlFor="edit-address-form__country"
          errorMessage={errors.countryCode?.message}
          required
        >
          <Select
            autoComplete="country"
            id="edit-address-form__country"
            placeholder="Select a country..."
            options={availableCountries?.map((country) => ({
              label: country.name,
              value: country.code,
            }))}
            {...register('countryCode', { required: true })}
            stretched
          />
        </Field>
      </div>

      <Field
        label="Phone"
        htmlFor="edit-address-form__phone"
        errorMessage={errors.phone?.message}
      >
        <Input
          type="tel"
          id="edit-address-form__phone"
          autoComplete="phone"
          {...register('phone')}
          stretched
        />
      </Field>

      <ButtonTray align="right">
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
        {children}
      </ButtonTray>
    </form>
  );
};

export default CustomerAddressForm;
