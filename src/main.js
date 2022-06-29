import { createApp } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core'; // Must import from /core to avoid React import :/
import { setContext } from '@apollo/client/link/context';
import AppEntry from './App.vue';
import './index.css';

const token = '<insert-your-token-here>';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${token}`,
  },
}));

const typePolicies = {
  Query: {
    fields: {
      search: {
        keyArgs: false,
        merge(existing = {}, incoming) {
          const toCache = {
            ...existing,
            ...incoming,
            nodes: [
              ...(existing?.nodes || []),
              ...incoming.nodes,
            ],
          };

          return toCache;
        },
      },
    },
  },
};

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies,
  }),
});

const app = createApp(AppEntry);
app.provide(DefaultApolloClient, apolloClient);
app.mount('#app');
