import {
  AvailableCountriesQuery,
  OrderAddress,
} from '@/graphql-types.generated';

export function AddressForm({
  address,
  defaultFullName,
  availableCountries,
}: {
  address?: OrderAddress | null;
  defaultFullName?: string;
  availableCountries?: AvailableCountriesQuery['availableCountries'];
}) {
  return (
    <div>
      <div>
        <label htmlFor="fullName">First name</label>
        <div>
          <input
            type="text"
            id="fullName"
            name="fullName"
            defaultValue={defaultFullName}
            autoComplete="given-name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company">Company</label>
        <div>
          <input
            type="text"
            name="company"
            id="company"
            defaultValue={address?.company ?? ''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="streetLine1">Address</label>
        <div>
          <input
            type="text"
            name="streetLine1"
            id="streetLine1"
            defaultValue={address?.streetLine1 ?? ''}
            autoComplete="street-address"
          />
        </div>
      </div>

      <div>
        <label htmlFor="streetLine2">Apartment, suite, etc.</label>
        <div>
          <input
            type="text"
            name="streetLine2"
            id="streetLine2"
            defaultValue={address?.streetLine2 ?? ''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="city">City</label>
        <div>
          <input
            type="text"
            name="city"
            id="city"
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="countryCode">Country</label>
        <div>
          {availableCountries && (
            <select
              id="countryCode"
              name="countryCode"
              defaultValue={address?.countryCode ?? 'US'}
            >
              {availableCountries.map((item) => (
                <option key={item.id} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="province">State / Province</label>
        <div>
          <input
            type="text"
            name="province"
            id="province"
            defaultValue={address?.province ?? ''}
            autoComplete="address-level1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="postalCode">Postal code</label>
        <div>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            defaultValue={address?.postalCode ?? ''}
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone</label>
        <div>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            defaultValue={address?.phoneNumber ?? ''}
            autoComplete="tel"
          />
        </div>
      </div>
    </div>
  );
}
