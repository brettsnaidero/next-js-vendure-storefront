import gql from 'graphql-tag';
import { OrderDetailFragment } from '../orders/order';

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

export const AvailableCountriesQuery = gql`
  query availableCountries {
    availableCountries {
      id
      name
      code
    }
  }
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
