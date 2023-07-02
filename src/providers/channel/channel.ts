import gql from 'graphql-tag';

export const ActiveChannelQuery = gql`
  query activeChannel {
    activeChannel {
      id
      currencyCode
    }
  }
`;
