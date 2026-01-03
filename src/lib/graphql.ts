import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '../graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    Timestamp: number;
  };
}>();

export { readFragment } from 'gql.tada';
export type { FragmentOf, ResultOf, TadaDocumentNode, VariablesOf } from 'gql.tada';
