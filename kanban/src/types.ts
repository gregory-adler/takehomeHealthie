export type Character = {
  id: string;
  name: string;
  image: string;
  species: string;
};

export type ColumnId = "todo" | "doing" | "done";

export type Item = {
  id: string;
  title: string;
  // A copy of the character, not just its id, so a card can render
  // on its own without waiting for the API (and survives a reload
  // if we add persistence later).
  character: Character;
};

export type BoardState = {
  // Every item, looked up by id
  items: Record<string, Item>;
  // Each column is an ordered list of item ids. The column an id sits in
  // is the item's status, and its position in the list is its order.
  columns: Record<ColumnId, string[]>;
};

export const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];
