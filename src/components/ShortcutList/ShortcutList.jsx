
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const ShortcutList = (props) => {

  const { edition, shortcutList, children, onObjDragEnd } = props

  const getItemStyle = (isDragging, draggableStyle) => {
    console.log("🚀 ~ file: ShortcutList.jsx:9 ~ getItemStyle ~ draggableStyle:", draggableStyle)
    
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      width: "100%",


      // change background colour if dragging
      boxShadow : isDragging ? "0px 0px 30px -2px limegreen" : "none",

      // styles we need to apply on draggables
      ...draggableStyle
  }};

  const getListStyle = isDraggingOver => ({
    display: "flex",
    gap: "1rem",
    flexDirection: "column",
  });

  const onDragEnd = (result) => {
    onObjDragEnd(result)
  }

  if (!Array.isArray(shortcutList)) {
    return <></>
  }


  return edition ? (
    <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {
              (provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {shortcutList.map((shortcut, index) => ( 
                        <Draggable key={shortcut.id} draggableId={shortcut.id} index={index}>
                          {
                            (provided, snapshot) => (
                              <div
                                className="drag-wrapper"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {children(shortcut)}
                              </div>
                            )
                          }
                        </Draggable>
                      )
                    )}
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>
  ):(
    shortcutList.map((shortcut) => (
      <>{children(shortcut)}</>
    ))
  )
}

ShortcutList.propTypes = {}