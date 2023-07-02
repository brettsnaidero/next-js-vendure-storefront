import { gql } from '@apollo/client';

export const CollectionsQuery = gql`
  query collections {
    collections {
      items {
        id
        name
        slug
        parent {
          name
        }
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;

export const CollectionQuery = gql`
  query collection($slug: String, $id: ID) {
    collection(slug: $slug, id: $id) {
      id
      name
      slug
      breadcrumbs {
        id
        name
        slug
      }
      children {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;
