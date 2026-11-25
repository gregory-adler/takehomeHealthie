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

// A board with a, b, c in To Do and d in In Progress
function makeBoard(): BoardState {
  let board = initialBoardState;
  for (const id of ["a", "b", "c", "d"]) {
    board = boardReducer(board, { type: "addItem", item: makeItem(id) });
  }
  return boardReducer(board, {
    type: "moveItem",
    from: { columnId: "todo", index: 3 },
    to: { columnId: "inProgress", index: 0 },
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
      to: { columnId: "inProgress", index: 1 },
    });

    expect(board.columns.todo).toEqual(["b", "c"]);
    expect(board.columns.inProgress).toEqual(["d", "a"]);
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

  describe("deleteItem", () => {
    it("removes the item from its column and from items", () => {
      const board = boardReducer(makeBoard(), { type: "deleteItem", itemId: "b" });

      expect(board.columns.todo).toEqual(["a", "c"]);
      expect(board.items.b).toBeUndefined();
      expect(Object.keys(board.items).sort()).toEqual(["a", "c", "d"]);
    });

    it("finds the item in a column other than To Do", () => {
      const board = boardReducer(makeBoard(), { type: "deleteItem", itemId: "d" });

      expect(board.columns.inProgress).toEqual([]);
      expect(board.columns.todo).toEqual(["a", "b", "c"]);
      expect(board.items.d).toBeUndefined();
    });

    it("leaves the other columns' arrays untouched", () => {
      const before = makeBoard();
      const after = boardReducer(before, { type: "deleteItem", itemId: "d" });

      expect(after.columns.todo).toBe(before.columns.todo);
      expect(after.columns.done).toBe(before.columns.done);
      expect(after.columns.inProgress).not.toBe(before.columns.inProgress);
    });

    it("returns the same state for an unknown id", () => {
      const before = makeBoard();
      const after = boardReducer(before, { type: "deleteItem", itemId: "nope" });

      expect(after).toBe(before);
    });

    it("doesn't mutate the previous state", () => {
      const before = makeBoard();
      const todoBefore = [...before.columns.todo];

      boardReducer(before, { type: "deleteItem", itemId: "a" });

      expect(before.columns.todo).toEqual(todoBefore);
      expect(before.items.a).toBeDefined();
    });
  });
});
