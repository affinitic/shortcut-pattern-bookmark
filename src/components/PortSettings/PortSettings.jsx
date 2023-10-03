import React, {useState} from 'react'
import { useForm } from "react-hook-form";
import { Tooltip, IconButton, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect } from 'react';
import {ButtonIcon} from '..';

import './PortSettings.scss';

const blankValue = {
  id: uuidv4(),
  ports: null,
  siteRoots: null
}

const formToData = (formData) => {
  const tempOut = {}
  Object.keys(formData).forEach(key => {
    const keySplit = key.split('_')
    const id = keySplit[1];
    const field = keySplit[0]
    let value = formData[key]
    if (field === "siteRoots" && !Array.isArray(value)) {
      value = formData[key] ? formData[key].split(",").map(value => value.trim()) : undefined;
    }
    if (id in tempOut) {
      tempOut[id][field] = value;
    } else {
      tempOut[id] = {[field] : value};
    }
  })
  const output = Object.values(tempOut).sort((a,b)=>{
    const x = a.order;
    const y = b.order;
    if(x>y){return 1;} 
    if(x<y){return -1;}
    return 0;
  }).map((item)=>{
    const {order, ...values} = item;
    return values;
  })
  return output;
}

const transformValueToDefault = (values) => {
  const output = {}
  values.forEach((value, index)=>{
    Object.keys(value).forEach((key)=>{
      let ouputValue = value[key]
      if (Array.isArray(ouputValue)) {
        ouputValue.join(", ")
      }
      output[`${key}_${value.id}`] = ouputValue
    })
    output[`order_${value.id}`] = index
  })
  return output;
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const PortSettings = (props) => {
  const {value, onSubmitForm} = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    unregister
  } = useForm({
    defaultValues: transformValueToDefault(value)
  });

  const onSubmit = (data) => {
    onSubmitForm(formToData(data));
  };

  const [portList, setPortList] = useState(value ? value : [blankValue])

  useEffect(() => {
    portList.forEach((port, index) => {
      setValue(`order_${port.id}`,index)
    })
  },[portList])

  const onClickButtonNewPorts = () => {
    setPortList(prev => [...prev, { ...blankValue, id:uuidv4() }])
  }

  const onDragEnd = (result) => {
    setPortList((prev)=> 
      reorder(prev, result.source.index, result.destination.index),
    )

  }

  const getItemStyle = (isDragging, draggableStyle) => {
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: "1rem",
      border: "1px dashed gray",

      // change background colour if dragging
      boxShadow: isDragging ? "0px 0px 30px -2px limegreen" : "none",

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  };

  const getListStyle = () => ({
    display: "flex",
    gap: "1rem",
    flexDirection: "column",

  });

  const onClickDelete = (data, id)=> {
    setPortList((prev)=>prev.filter((item => item.id !== id)))
    unregister([
      `order_${id}`,
      `id_${id}`,
      `ports_${id}`,
      `siteRoots_${id}`
    ])
  };

  return (
    <div className="port-settings-form">
      <DialogTitle as="h3">Ports Settings</DialogTitle>
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {portList.map((port, index) =>{
                    return (
                    <Draggable
                      key={port.id}
                      draggableId={port.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="drag-wrapper"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <div className="delete-button">
                            <ButtonIcon
                              name="close"
                              title="Delete"
                              onClick={onClickDelete}
                              id={port.id} 
                            />
                          </div>
                          <div className={`port-${port.id}-group port-group`}>
                            <div className={`order-${port.id}-field field hidden`}>
                              <input
                                type="hidden"
                                {...register(`order_${port.id}`, { required: false })}
                              />
                            </div>
                            <div className={`id-${port.id}-field field hidden`}>
                              <input readOnly type="hidden" {...register(`id_${port.id}`, { required: false })}/>
                            </div>
                            <div className={`ports-${port.id}-field field`}>
                              <label className="main">Ports</label>
                              <label className="description">
                                List of port, separated by a comma or use dash for range.
                              </label>
                              <input {...register(`ports_${port.id}`, { required: true })} />
                              {errors[`ports_${port.id}`] && (
                                <span className="error">This field is required</span>
                              )}
                            </div>
                            <div className={`siteRoots-${port.id}-field field`}>
                              <label className="main">Site root</label>
                              <label className="description">
                                {"List of site root associate to, comma separated. You can use {%no_site_root%} if there is no site root needed."}
                              </label>
                              <input {...register(`siteRoots_${port.id}`, { required: true })}/>
                              {errors[`siteRoots_${port.id}`] && (
                                <span className="error">This field is required</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )})}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        <Tooltip title="Add new ports" className="new-ports-tooltip">
          <IconButton
            className="new-ports-button"
            aria-label="Add new ports"
            variant="outlined"
            onClick={onClickButtonNewPorts}
            color="primary"
          >
            <AddIcon color="primary" />
          </IconButton>
        </Tooltip>
        <input type="submit" />
        </form>
      </div>
    </div>
  )
}
