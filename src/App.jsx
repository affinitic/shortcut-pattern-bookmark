
import {useEffect, useState, useRef} from 'react';
import {NewShortcutForm, Shortcut, ShortcutList} from './components';
import  { Tooltip, IconButton, Stack, Box } from '@mui/material';
import { useGetCurrentTabUrl, setStorageList, stringToId  } from '@root/utils';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


// import {data} from './data';

import './App.scss'

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

function App(props) {

  const { data } = props;

  const [openDialog, setOpenDialog] = useState(false);
  const inputRef = useRef(null);

  const [shortcutList, setShortcutList] = useState(data);
  console.log("🚀 ~ file: App.jsx:20 ~ App ~ shortcutList:", shortcutList)
  const [canWrite, setCanWrite] = useState(false);

  const [edition, setEdition] = useState(false);

  useEffect(()=>{
    if (canWrite) {
      setStorageList(shortcutList)
      setCanWrite(false)
    }
  },[shortcutList]);

  const handleOnCloseDialog = () => {
    setOpenDialog(false)
  };

  const handleSubmitForm = (data) => {
    setCanWrite(true)
    setShortcutList((prev) =>{
      if (Array.isArray(prev)) {
        return [...prev, {id: stringToId(data.name), name: data.name, pattern: data.pattern}]
      } else if (typeof prev === 'object') {
        return [{id: stringToId(data.name), name: data.name, pattern: data.pattern}]
      }
    })
  }
  
  const onClickButtonNewShortcut = () => {
    setOpenDialog(true)
  }

  const onClickImport = () => {
    inputRef.current.click();
  }

  const onClickDelete = () => {
    setEdition((prev)=>!prev);
  }

  const generateFileUrl = () => {
    const exportData = JSON.stringify(shortcutList, null, 4);
    const blob = new Blob([exportData], {type: "application/json"});
    return window.URL.createObjectURL(blob);
  }

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj || fileObj.type !== "application/json") {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      let json = JSON.parse(atob(event.target.result.split(",")[1]));
      // todo add schema verifaction
      setCanWrite(true)
      if (Array.isArray(json)) {
        json = json.map((item)=>{
          const id = item.id ? item.id : stringToId(item.name)
          return {
            ...item,
            id
          }
        });
        setShortcutList((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, ...json]
          }
          return json
        });

      } else if (typeof json === 'object') {
        const id = json.id ? json.id : stringToId(json.name)
        setShortcutList((prev) => [...prev, {...json, id}]);
      }
    });
    reader.readAsDataURL(fileObj);

  };

  const onDeletion = (shortcutId) => {
    setCanWrite(true);
    setShortcutList((prev) => prev.filter((shortcut) => shortcut.id !== shortcutId));
  }

  const currentTabUrl = useGetCurrentTabUrl() || ""
  // const currentTabUrl = ""

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setCanWrite(true);
    setShortcutList((prev) => (
      reorder(
        prev,
        result.source.index,
        result.destination.index
      )
    ))
  }

  return (
    <>
      <Box sx={{ width: '100%' }} className="shortcut-list">
        <Stack spacing={2}>
        Hold option key while clicking on the bookmark button to create a new tab
        <ShortcutList edition={edition} shortcutList={shortcutList} onObjDragEnd={onDragEnd}>
        {
          (shortcut) => (
            <>
              <Shortcut
                key={shortcut.id}
                id={shortcut.id}
                variant="contained"
                name={shortcut.name}
                pattern={shortcut.pattern}
                currentTabUrl={currentTabUrl}
                edition={edition}
                onDeletion={onDeletion}
              />
            </>
          )
        }
        </ShortcutList>
        <div className="tools">
          <Tooltip title="Add new shortcut" className='new-shortcut-tooltip'>
            <IconButton
              className='new-shortcut-button'
              aria-label="Add new shortcut"
              variant="outlined"
              onClick={onClickButtonNewShortcut}
              color="primary"
            >
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>
            <input
              style={{display: 'none'}}
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
            />
          <Tooltip title="Import" className='import-shortcut-tooltip'>
            <IconButton
              className='import-shortcut-button'
              aria-label="Import"
              variant="outlined"
              onClick={onClickImport}
              color="primary"
            >
              <FileUploadIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export" className='export-shortcut-tooltip'>
            <IconButton
              className='export-shortcut-button'
              aria-label="Export"
              variant="outlined"
              href={generateFileUrl()}
              download="Export.json"
              color="primary"
            >
              <FileDownloadIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" className='delete-shortcut-tooltip'>
            <IconButton
              className='delete-shortcut-button'
              aria-label="Delete"
              variant="outlined"
              onClick={onClickDelete}
              color="primary"
            >
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
        </Stack>
      </Box>
     <NewShortcutForm open={openDialog} onClose={handleOnCloseDialog} onSubmitForm={handleSubmitForm}/>
    </>
  )
}

export default App
