import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import {Dialog, DialogTitle} from '@mui/material';

import './NewShortcutForm.scss';

export const NewShortcutForm = (props) => {
  const { onClose, onSubmitForm, open } = props;
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    onSubmitForm(data)
    onClose()
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} className='newShortcutForm'>
      <DialogTitle>Add new shortcut</DialogTitle>
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="name-field field">
            <label className="main">Name</label>
            <label className="description">Enter the name for the shortcut</label>
            <input {...register("name", { required: true })} />
            { errors.exampleRequired && <span className="error">This field is required</span> }
          </div>
          <div className="pattern-field field">
            <label className="main">Pattern</label>
            <label className="description">Enter the pattern that will be use for the shortcut</label>
            <input {...register("pattern", { required: true })} />
            { errors.exampleRequired && <span className="error">This field is required</span> }
            <label className="exemple">
              You can use some variable in the pattern :
              <ul>
                <li>{'{%scheme%} : Scheme of the url (eg: http or https)'}</li>
                <li>{'{%domain%} : Domain name of the url'}</li>
                <li>{'{%port%} : Port of the url (and site root), if there is no port it will be ignore)'}</li>
                <li>{'{%start%} : Concatenation of scheme, domain and port of the url'}</li>
                <li>{'{%path%} : Path of the url, if there is no path it will be ignore)'}</li>
                <li>{'{%query%} : Query of the url (part after "?"), if there is no query it will be ignore)'}</li>
              </ul>
            </label>
          </div>
          <input type="submit" />
        </form>
      </div>
    </Dialog>
  )
}

NewShortcutForm.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}
