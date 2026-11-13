import { useState, type FormEvent } from "react";
import type { Character, Item } from "../types";

type Props = {
  characters: Character[];
  isLoading: boolean;
  onAdd: (item: Item) => void;
};

export function NewItemForm({ characters, isLoading, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [characterId, setCharacterId] = useState("");

  const selectedCharacter = characters.find((c) => c.id === characterId);
  const canSubmit = title.trim() !== "" && selectedCharacter !== undefined;

  function handleSubmit(event: FormEvent) {
    event.preventDefault(); // stop the browser from reloading the page
    if (!selectedCharacter || title.trim() === "") return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      character: selectedCharacter,
    });

    // Clear the form for the next item
    setTitle("");
    setCharacterId("");
  }

  return (
    <form className="new-item-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs doing?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Item title"
      />

      <select
        value={characterId}
        onChange={(e) => setCharacterId(e.target.value)}
        disabled={isLoading}
        aria-label="Assign a character"
      >
        <option value="">
          {isLoading ? "Loading characters..." : "Assign a character"}
        </option>
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </select>

      <button type="submit" disabled={!canSubmit}>
        Add
      </button>
    </form>
  );
}
