import { gql } from '@apollo/client';

export const LoginMutation = gql`
  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $email, password: $password, rememberMe: $rememberMe) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const LogoutMutation = gql`
  mutation logout {
    logout {
      success
    }
  }
`;

export const RegisterCustomerAccountMutation = gql`
  mutation registerCustomerAccount($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const VerifyCustomerAccountMutation = gql`
  mutation verifyCustomerAccount($token: String!, $password: String) {
    verifyCustomerAccount(token: $token, password: $password) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const UpdateCustomerMutation = gql`
  mutation updateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      __typename
    }
  }
`;

export const RequestUpdateCustomerEmailAddressMutation = gql`
  mutation requestUpdateCustomerEmailAddress(
    $password: String!
    $newEmailAddress: String!
  ) {
    requestUpdateCustomerEmailAddress(
      password: $password
      newEmailAddress: $newEmailAddress
    ) {
      __typename
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const UpdateCustomerEmailAddressMutation = gql`
  mutation updateCustomerEmailAddress($token: String!) {
    updateCustomerEmailAddress(token: $token) {
      __typename
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const UpdateCustomerAddressMutation = gql`
  mutation updateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      __typename
    }
  }
`;

export const CreateCustomerAddressMutation = gql`
  mutation createCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      __typename
    }
  }
`;

export const DeleteCustomerAddressMutation = gql`
  mutation deleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`;

export const UpdateCustomerPasswordMutation = gql`
  mutation updateCustomerPassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    updateCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ForgotPasswordMutation = gql`
  mutation requestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const ResetPasswordMutation = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      __typename
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;
