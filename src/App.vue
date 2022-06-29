<script setup>
import { computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const { result, fetchMore } = useQuery(
  gql`
    query ExampleQuery($endCursor: String) {
      search(
        query: "Star Wars"
        type: REPOSITORY
        first: 5
        after: $endCursor
      ) {
        nodes {
          ... on Repository {
            id
            name
            description
          }
        }
        pageInfo {
          endCursor
        }
      }
    }
  `
);

const loadMore = () => {
  fetchMore({
    variables: {
      endCursor: endCursor.value,
    },
  });
};

const repos = computed(() => {
  return result.value?.search.nodes;
});
const endCursor = computed(() => {
  return result.value?.search.pageInfo.endCursor;
});
</script>

<template>
  <div class="p-8 flex flex-col space-y-2">
    <div
      class="rounded py-4 px-5 bg-slate-100"
      v-for="repo in repos"
      :key="repo.id"
    >
      <h2 class="font-bold">{{ repo.name }}</h2>
      <p class="mt-1 text-sm">{{ repo.description }}</p>
    </div>
    <button
      class="bg-green-200 hover:bg-green-300 p-2 rounded"
      @click="loadMore"
    >
      Load More
    </button>
  </div>
</template>
