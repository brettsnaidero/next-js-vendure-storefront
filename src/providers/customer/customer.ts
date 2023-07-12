import { gql } from '@apollo/client';

export const ActiveCustomerQuery = gql`
  query activeCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      phoneNumber
      emailAddress
    }
  }
`;

export const ActiveCustomerAddressesFragment = gql`
  fragment ActiveCustomerAddresses on Address {
    id
    company
    fullName
    streetLine1
    streetLine2
    city
    province
    postalCode
    country {
      id
      code
      name
    }
    phoneNumber
    defaultShippingAddress
    defaultBillingAddress
  }
`;

export const ActiveCustomerAddressesQuery = gql`
  query activeCustomerAddresses {
    activeCustomer {
      id
      addresses {
        ...ActiveCustomerAddresses
      }
    }
  }
  ${ActiveCustomerAddressesFragment}
`;

export const ActiveCustomerOrderListQuery = gql`
  query activeCustomerOrderList($orderListOptions: OrderListOptions) {
    activeCustomer {
      orders(options: $orderListOptions) {
        totalItems
        items {
          code
          state
          orderPlacedAt
          currencyCode
          subTotal
          subTotalWithTax
          total
          totalWithTax
          shippingWithTax
          shippingLines {
            priceWithTax
          }
          taxSummary {
            taxBase
            taxTotal
          }
          discounts {
            amountWithTax
          }
          fulfillments {
            trackingCode
          }
          lines {
            quantity
            discountedLinePriceWithTax
            discountedUnitPriceWithTax
            fulfillmentLines {
              quantity
              fulfillment {
                state
                updatedAt
              }
            }
            featuredAsset {
              name
              source
              preview
            }
            productVariant {
              name
              sku
              currencyCode
              priceWithTax
              product {
                slug
              }
            }
          }
        }
      }
    }
  }
`;
