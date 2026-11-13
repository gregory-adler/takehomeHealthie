import { Droppable } from "@hello-pangea/dnd";
import type { ColumnId, Item } from "../types";
import { ItemCard } from "./ItemCard";

type Props = {
  id: ColumnId;
  title: string;
  items: Item[];
};

export function Column({ id, title, items }: Props) {
  return (
    <section className={`column column-${id}`}>
      <h2>
        {title} <span className="count">{items.length}</span>
      </h2>

      {/* Droppable marks this list as a place cards can be dropped */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-list ${snapshot.isDraggingOver ? "is-over" : ""}`}
          >
            {items.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}

            {/* Holds open space for the card being dragged */}
            {provided.placeholder}

            {items.length === 0 && !snapshot.isDraggingOver && (
              <p className="empty">Nothing here yet</p>
            )}
          </div>
        )}
      </Droppable>
    </section>
  );
}
