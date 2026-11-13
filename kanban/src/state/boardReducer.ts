import type { BoardState, ColumnId, Item } from "../types";

// Every change to the board goes through this one function.
// That makes changes easy to follow, easy to test, and gives us a single
// place to hook in later features (persistence, undo, filtering).

export type BoardAction =
  | { type: "addItem"; item: Item }
  | {
      type: "moveItem";
      from: { columnId: ColumnId; index: number };
      to: { columnId: ColumnId; index: number };
    };

export const initialBoardState: BoardState = {
  items: {},
  columns: { todo: [], doing: [], done: [] },
};

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "addItem": {
      // New items go to the bottom of To Do
      return {
        items: { ...state.items, [action.item.id]: action.item },
        columns: {
          ...state.columns,
          todo: [...state.columns.todo, action.item.id],
        },
      };
    }

    case "moveItem": {
      const { from, to } = action;

      // Copy the arrays instead of changing them, because React state
      // must be replaced, not mutated. If from and to are the same column,
      // both lines write the same key, so there's one array and the
      // splice calls below reorder within it.
      const columns = { ...state.columns };
      columns[from.columnId] = [...columns[from.columnId]];
      columns[to.columnId] = [...columns[to.columnId]];

      // Take the id out of its old spot and put it in the new one
      const [movedId] = columns[from.columnId].splice(from.index, 1);
      columns[to.columnId].splice(to.index, 0, movedId);

      return { ...state, columns };
    }
  }
}
