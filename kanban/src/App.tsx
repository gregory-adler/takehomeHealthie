import { useReducer } from "react";
import { useCharacters } from "./api/useCharacters";
import { Board } from "./components/Board";
import { NewItemForm } from "./components/NewItemForm";
import { boardReducer, initialBoardState } from "./state/boardReducer";
import { celebrate } from "./celebrate";
import type { ColumnId, Item } from "./types";

export default function App() {
  const { characters, isLoading, error } = useCharacters();
  const [board, dispatch] = useReducer(boardReducer, initialBoardState);

  function handleAdd(item: Item) {
    dispatch({ type: "addItem", item });
  }

  function handleMove(
    from: { columnId: ColumnId; index: number },
    to: { columnId: ColumnId; index: number },
  ) {
    dispatch({ type: "moveItem", from, to });

    // Celebrate only when a card arrives in Done, not when it's
    // reordered inside Done
    if (to.columnId === "done" && from.columnId !== "done") {
      celebrate();
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Rick &amp; Morty Kanban</h1>
        <NewItemForm characters={characters} isLoading={isLoading} onAdd={handleAdd} />
        {error && <p className="error">Couldn't load characters: {error}</p>}
      </header>

      <Board board={board} onMove={handleMove} />
    </main>
  );
}
