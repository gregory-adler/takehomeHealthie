import { useEffect, useState } from "react";
import type { Character } from "../types";
import { fetchCharacters } from "./rickAndMorty";

// Loads the character list once, and tracks loading and error states
export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the component unmounts before the request finishes,
    // don't try to update its state
    let cancelled = false;

    fetchCharacters()
      .then((results) => {
        if (!cancelled) setCharacters(results);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { characters, isLoading, error };
}
