import React from 'react'
import { useForm } from "react-hook-form";
import { Dialog, DialogTitle } from "@mui/material";
import { PortSettings } from '@root/components/';

export const SettingsForm = (props) => {
  const { onClose, onSubmitForm, open, portList } = props;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleClose = () => {
    onClose();
  };
  
  const onSubmitPortsForm = (data) => {
    onSubmitForm({ports: data})
    onClose();
  }

  return (
    <Dialog onClose={handleClose} open={open} className="settings-dialog">
      <DialogTitle>Settings</DialogTitle>
      <PortSettings value={portList} onSubmitForm={onSubmitPortsForm}/>
    </Dialog>
  )
}
