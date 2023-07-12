import {
  AvailableCountriesQuery,
  OrderAddress,
} from '@/graphql-types.generated';
import { useForm } from 'react-hook-form';
import Select from '@/components/form/select';
import Input from '@/components/form/input';
import Field from '@/components/form/field';
import styles from '@/styles/components/address-form.module.css';

export interface ShippingForm {
  fullName?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  country: string;
  state?: string;
  postalCode?: string;
  phone?: string;
}

const AddressForm = ({
  address,
  defaultFullName,
  availableCountries,
  onChange,
  setAddressFormChanged,
}: {
  address?: OrderAddress | null;
  defaultFullName?: string;
  availableCountries?: AvailableCountriesQuery['availableCountries'];
  onChange: (address: ShippingForm) => void;
  setAddressFormChanged: (value: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    defaultValues: {
      fullName: defaultFullName ?? '',
      company: address?.company ?? '',
      addressLine1: address?.streetLine1 ?? '',
      addressLine2: address?.streetLine2 ?? '',
      city: address?.city ?? '',
      country: address?.countryCode ?? 'AU',
      state: address?.province ?? '',
      postalCode: address?.postalCode ?? '',
      phone: address?.phoneNumber ?? '',
    },
  });

  return (
    <form
      className={styles.form}
      onBlur={handleSubmit(onChange)}
      onChange={() => setAddressFormChanged(true)}
    >
      <Field label="Name" htmlFor="address-form__name">
        <Input
          type="text"
          id="address-form__name"
          autoComplete="given-name"
          {...register('fullName')}
          stretched
        />
      </Field>

      <Field label="Company" htmlFor="address-form__company">
        <Input
          type="text"
          id="address-form__company"
          {...register('company')}
          stretched
        />
      </Field>

      <Field
        label="Address"
        htmlFor="address-form__street-line-1"
        required
        errorMessage={errors.addressLine1?.message}
      >
        <Input
          type="text"
          id="address-form__street-line-1"
          autoComplete="street-address"
          {...register('addressLine1', { required: true })}
          stretched
        />
      </Field>

      <Field
        label="Apartment, suite, etc."
        htmlFor="address-form__street-line-2"
      >
        <Input
          type="text"
          id="address-form__street-line-2"
          {...register('addressLine2')}
          stretched
        />
      </Field>

      <Field label="City" htmlFor="address-form__city">
        <Input
          type="text"
          id="address-form__city"
          autoComplete="address-level2"
          {...register('city')}
          stretched
        />
      </Field>

      <Field
        label="Country"
        htmlFor="address-form__country-code"
        errorMessage={errors.country?.message}
        required
      >
        {availableCountries && (
          <Select
            id="address-form__country-code"
            {...register('country', { required: true })}
            options={availableCountries.map((item) => ({
              value: item.code,
              label: item.name,
            }))}
            stretched
          />
        )}
      </Field>

      <Field label="State / Province" htmlFor="address-form__province">
        <Input
          type="text"
          id="address-form__province"
          autoComplete="address-level1"
          {...register('state')}
          stretched
        />
      </Field>

      <Field
        label="Postal code"
        htmlFor="address-form__postal-code"
        required
        errorMessage={errors.postalCode?.message}
      >
        <Input
          type="text"
          id="address-form__postal-code"
          autoComplete="postal-code"
          {...register('postalCode', { required: true })}
          stretched
        />
      </Field>

      <Field label="Phone" htmlFor="address-form__phone-number">
        <Input
          type="tel"
          id="address-form__phone-number"
          autoComplete="tel"
          {...register('phone')}
          stretched
        />
      </Field>
    </form>
  );
};

export default AddressForm;
