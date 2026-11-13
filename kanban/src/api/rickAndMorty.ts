import type { Character } from "../types";

const API_URL = "https://rickandmortyapi.com/graphql";

// GraphQL lets us ask for exactly the fields we use, nothing more
const CHARACTERS_QUERY = `
  query Characters($page: Int) {
    characters(page: $page) {
      results {
        id
        name
        image
        species
      }
    }
  }
`;

type CharactersResponse = {
  data?: { characters: { results: Character[] } };
  errors?: { message: string }[];
};

// GraphQL is just an HTTP POST with the query in the body,
// so plain fetch works and we don't need a client library like Apollo.
export async function fetchCharacters(page = 1): Promise<Character[]> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: CHARACTERS_QUERY, variables: { page } }),
  });

  if (!response.ok) {
    throw new Error(`Rick and Morty API returned ${response.status}`);
  }

  const json: CharactersResponse = await response.json();

  // A GraphQL API can return 200 OK with errors in the body
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data?.characters.results ?? [];
}
