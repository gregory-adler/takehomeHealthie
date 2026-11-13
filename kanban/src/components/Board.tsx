import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { COLUMNS, type BoardState, type ColumnId } from "../types";
import { Column } from "./Column";

type Props = {
  board: BoardState;
  onMove: (
    from: { columnId: ColumnId; index: number },
    to: { columnId: ColumnId; index: number },
  ) => void;
};

export function Board({ board, onMove }: Props) {
  // The drag library tells us where a card started and where it was dropped.
  // We translate that into our own move, so the rest of the app
  // doesn't need to know about the library.
  function handleDragEnd(result: DropResult) {
    const { source, destination } = result;

    // Dropped outside any column
    if (!destination) return;

    // Dropped back where it started
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    onMove(
      { columnId: source.droppableId as ColumnId, index: source.index },
      { columnId: destination.droppableId as ColumnId, index: destination.index },
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            items={board.columns[column.id].map((itemId) => board.items[itemId])}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
