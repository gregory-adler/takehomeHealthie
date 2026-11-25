import { describe, expect, it } from "vitest";
import { boardReducer, initialBoardState } from "./boardReducer";
import type { BoardState, Item } from "../types";

function makeItem(id: string): Item {
  return {
    id,
    title: `Item ${id}`,
    character: { id: "1", name: "Rick Sanchez", image: "", species: "Human" },
  };
}

// A board with a, b, c in To Do and d in Doing
function makeBoard(): BoardState {
  let board = initialBoardState;
  for (const id of ["a", "b", "c", "d"]) {
    board = boardReducer(board, { type: "addItem", item: makeItem(id) });
  }
  return boardReducer(board, {
    type: "moveItem",
    from: { columnId: "todo", index: 3 },
    to: { columnId: "doing", index: 0 },
  });
}

describe("boardReducer", () => {
  it("adds new items to the bottom of To Do", () => {
    const board = boardReducer(initialBoardState, { type: "addItem", item: makeItem("a") });

    expect(board.columns.todo).toEqual(["a"]);
    expect(board.items.a.title).toBe("Item a");
  });

  it("moves an item to another column at the drop position", () => {
    const board = boardReducer(makeBoard(), {
      type: "moveItem",
      from: { columnId: "todo", index: 0 },
      to: { columnId: "doing", index: 1 },
    });

    expect(board.columns.todo).toEqual(["b", "c"]);
    expect(board.columns.doing).toEqual(["d", "a"]);
  });

  it("reorders an item within the same column", () => {
    const board = boardReducer(makeBoard(), {
      type: "moveItem",
      from: { columnId: "todo", index: 0 },
      to: { columnId: "todo", index: 2 },
    });

    expect(board.columns.todo).toEqual(["b", "c", "a"]);
  });

  it("doesn't mutate the previous state", () => {
    const before = makeBoard();
    const todoBefore = [...before.columns.todo];

    boardReducer(before, {
      type: "moveItem",
      from: { columnId: "todo", index: 0 },
      to: { columnId: "done", index: 0 },
    });

    expect(before.columns.todo).toEqual(todoBefore);
  });
});
