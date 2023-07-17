import gql from 'graphql-tag';
import { OrderDetailFragment } from '../orders/order';

const EligibleShippingMethodsFragment = gql`
  fragment EligibleShippingMethodsFragment on ShippingMethodQuote {
    id
    name
    description
    metadata
    price
    priceWithTax
  }
`;

export const EligibleShippingMethodsQuery = gql`
  query eligibleShippingMethods {
    eligibleShippingMethods {
      id
      name
      description
      metadata
      price
      priceWithTax
    }
  }
`;

export const EligiblePaymentMethodsQuery = gql`
  query eligiblePaymentMethods {
    eligiblePaymentMethods {
      id
      code
      name
      description
      eligibilityMessage
      isEligible
    }
  }
`;

export const NextOrderStatesQuery = gql`
  query nextOrderStates {
    nextOrderStates
  }
`;

const AvailableCountriesFragment = gql`
  fragment AvailableCountriesFragment on Country {
    id
    name
    code
  }
`;

export const AvailableCountriesQuery = gql`
  query availableCountries {
    availableCountries {
      ...AvailableCountriesFragment
    }
  }
  ${AvailableCountriesFragment}
`;

export const CheckoutShippingQuery = gql`
  query checkoutShipping {
    eligibleShippingMethods {
      ...EligibleShippingMethodsFragment
    }
    availableCountries {
      ...AvailableCountriesFragment
    }
  }
  ${EligibleShippingMethodsFragment}
  ${AvailableCountriesFragment}
`;

export const AddPaymentToOrderMutation = gql`
  mutation addPaymentToOrder($input: PaymentInput!) {
    addPaymentToOrder(input: $input) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
  ${OrderDetailFragment}
`;

export const TransitionOrderToStateMutation = gql`
  mutation transitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ...OrderDetail
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
  ${OrderDetailFragment}
`;

export const CreateStripePaymentIntentMutation = gql`
  mutation createStripePaymentIntent {
    createStripePaymentIntent
  }
`;

export const GenerateBraintreeClientTokenQuery = gql`
  query generateBraintreeClientToken {
    generateBraintreeClientToken
  }
`;
