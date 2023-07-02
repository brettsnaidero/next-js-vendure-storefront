import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Address, AvailableCountriesQuery } from '@/graphql-types.generated';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { useForm } from 'react-hook-form';

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

const CustomerAddressForm = ({
  address,
  submit,
  availableCountries,
}: {
  address?: Address;
  submit: () => void;
  availableCountries: AvailableCountriesQuery['availableCountries'];
}) => {
  // TODO: Hook up to inputs/form
  const { register, handleSubmit } = useForm({
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
    <form id="editAddressForm" method="post" onSubmit={handleSubmit(submit)}>
      <div>
        <div>
          <Input
            label="Full name"
            name="fullName"
            required
            autoComplete="full-name"
          />
        </div>
        <Input label="Company" name="company" />
        <Input
          label="Address"
          name="streetLine1"
          required
          autoComplete="address-line1"
        />
        <Input
          label="Apartment, suite, etc."
          name="streetLine2"
          autoComplete="address-line2"
        />
        <div>
          <Input
            label="Postal code"
            name="postalCode"
            required
            autoComplete="postal-code"
          />
          <Input label="City" name="city" required autoComplete="locality" />
        </div>
        <Input
          label="Province / State"
          name="province"
          autoComplete="address-level1"
        />
        <Select
          name="countryCode"
          autoComplete="country"
          placeholder="Select a country..."
          required
          label="Country"
        >
          {availableCountries?.map((country) => (
            <option key={country.id} value={country.code}>
              {country.name}
            </option>
          ))}
        </Select>
        <Input label="Phone" name="phone" autoComplete="phone" />
      </div>
    </form>
  );
};

export default CustomerAddressForm;
