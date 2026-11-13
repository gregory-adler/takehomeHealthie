import { Draggable } from "@hello-pangea/dnd";
import type { Item } from "../types";

type Props = {
  item: Item;
  index: number; // position in the column, which the drag library needs
};

export function ItemCard({ item, index }: Props) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        // The library gives us props to spread onto the element:
        // draggableProps make it movable, dragHandleProps make it grabbable.
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`item-card ${snapshot.isDragging ? "is-dragging" : ""}`}
        >
          <img src={item.character.image} alt="" className="avatar" />
          <div>
            <div className="item-title">{item.title}</div>
            <div className="item-character">
              {item.character.name} · {item.character.species}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
