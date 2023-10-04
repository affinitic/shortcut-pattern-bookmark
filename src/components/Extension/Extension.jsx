import { useEffect, useState, useRef } from "react";
import {
  NewShortcutForm,
  Shortcut,
  ShortcutList,
  SettingsForm,
} from "@root/components";
import { Tooltip, IconButton, Stack, Box } from "@mui/material";
import { useGetCurrentTabUrl, setStorageList, generateId } from "@root/utils";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import { v4 as uuidv4 } from "uuid";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const checkForId = (items, key) => {
  return items.map((item) => {
    if ("id" in item) {
      return item;
    }
    let id = null;
    if (key == "shortcut") {
      id = generateId(item.name);
    } else if (key == "ports") {
      id = uuidv4();
    }
    return {
      ...item,
      id,
    };
  });
};

const setupList = (prev, json, key) => {
  const value = checkForId(json?.[key].items, key);
  const action = json?.[key]?.action;
  switch (action) {
    case "set":
      return value;
    case "add":
      return [...prev, value];
  }
};

export const Extension = (props) => {
  const { data } = props;

  const [openDialogNewForm, setOpenDialogNewForm] = useState(false);
  const [openDialogSettings, setOpenDialogSettings] = useState(false);
  const inputRef = useRef(null);

  const [shortcutList, setShortcutList] = useState(data.shortcut);
  const [porstList, setPortsList] = useState(data.ports);
  const [canWrite, setCanWrite] = useState(false);

  const [edition, setEdition] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: null,
    pattern: null,
  });

  useEffect(() => {
    if (canWrite) {
      setStorageList({
        shortcut: shortcutList,
        ports: porstList,
      });
      setCanWrite(false);
    }
  }, [shortcutList, porstList]);

  const handleOnCloseDialog = () => {
    setOpenDialogNewForm(false);
    setOpenDialogSettings(false);
  };

  const handleSubmitForm = (data, edit) => {
    setCanWrite(true);
    if (edit) {
      setShortcutList((prev) => {
        return prev.map((item) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });
      });
    } else {
      setShortcutList((prev) => {
        if (data.id && data.id !== "") {
          prev.map((shortcut) => {
            if (shortcut.id === data.id) {
              return {
                ...data,
              };
            }
            return shortcut;
          });
        }
        if (Array.isArray(prev)) {
          return [
            ...prev,
            {
              id: generateId(data.name, shortcutList),
              name: data.name,
              pattern: data.pattern,
            },
          ];
        } else if (typeof prev === "object") {
          return [
            {
              id: generateId(data.name, shortcutList),
              name: data.name,
              pattern: data.pattern,
            },
          ];
        }
      });
    }
  };

  const onClickButtonNewShortcut = () => {
    setOpenDialogNewForm(true);
  };

  const onClickImport = () => {
    inputRef.current.click();
  };

  const onClickDelete = () => {
    setEdition((prev) => !prev);
  };

  const onClickSettings = () => {
    setOpenDialogSettings(true);
  };

  const generateFileUrl = () => {
    const exportData = JSON.stringify(
      {
        shortcut: {
          action: "set",
          items: shortcutList,
        },
        ports: {
          action: "set",
          items: porstList,
        },
      },
      null,
      4,
    );
    const blob = new Blob([exportData], { type: "application/json" });
    return window.URL.createObjectURL(blob);
  };

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj || fileObj.type !== "application/json") {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      let json = JSON.parse(atob(event.target.result.split(",")[1]));
      // todo add schema verifaction
      setShortcutList((prev) => setupList(prev, json, "shortcut"));
      setCanWrite(true);
      setPortsList((prev) => setupList(prev, json, "ports"));
    });
    reader.readAsDataURL(fileObj);
  };

  const onDeletion = (shortcutId) => {
    setCanWrite(true);
    setShortcutList((prev) =>
      prev.filter((shortcut) => shortcut.id !== shortcutId),
    );
  };

  const currentTabUrl = useGetCurrentTabUrl() || "";

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setCanWrite(true);
    setShortcutList((prev) =>
      reorder(prev, result.source.index, result.destination.index),
    );
  };

  const onClickEdit = (data) => {
    const editId = data.target.attributes.buttonid.value;
    if (!editId || editId === "") {
      return;
    }
    const editObj = shortcutList.filter((shortcut) => shortcut.id === editId);
    if (editObj.length < 1) {
      return;
    }
    setFormData({ ...editObj[0] });
    setOpenDialogNewForm(true);
  };

  const onSubmitSettingsForm = (data) => {
    if ("ports" in data) {
      setCanWrite(true);
      setPortsList(data.ports);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }} className="shortcut-list">
        <Stack spacing={2}>
          Hold option key while clicking on the bookmark button to create a new
          tab
          <ShortcutList
            edition={edition}
            shortcutList={shortcutList}
            onObjDragEnd={onDragEnd}
            onClickEdit={onClickEdit}
          >
            {(shortcut) => (
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
                  ports={porstList}
                />
              </>
            )}
          </ShortcutList>
          <div className="tools">
            <Tooltip title="Add new shortcut" className="new-shortcut-tooltip">
              <IconButton
                className="new-shortcut-button"
                aria-label="Add new shortcut"
                variant="outlined"
                onClick={onClickButtonNewShortcut}
                color="primary"
              >
                <AddIcon color="primary" />
              </IconButton>
            </Tooltip>
            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              onChange={handleFileChange}
            />
            <Tooltip title="Import" className="import-shortcut-tooltip">
              <IconButton
                className="import-shortcut-button"
                aria-label="Import"
                variant="outlined"
                onClick={onClickImport}
                color="primary"
              >
                <FileUploadIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export" className="export-shortcut-tooltip">
              <IconButton
                className="export-shortcut-button"
                aria-label="Export"
                variant="outlined"
                href={generateFileUrl()}
                download="Export.json"
                color="primary"
              >
                <FileDownloadIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" className="edit-shortcut-tooltip">
              <IconButton
                className="edit-shortcut-button"
                aria-label="Edit"
                variant="outlined"
                onClick={onClickDelete}
                color="primary"
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings" className="settings-shortcut-tooltip">
              <IconButton
                className="settings-shortcut-button"
                aria-label="Settings"
                variant="outlined"
                onClick={onClickSettings}
                color="primary"
              >
                <SettingsIcon color="primary" />
              </IconButton>
            </Tooltip>
          </div>
        </Stack>
      </Box>
      {openDialogNewForm ? (
        <NewShortcutForm
          open={openDialogNewForm}
          onClose={handleOnCloseDialog}
          onSubmitForm={handleSubmitForm}
          formData={formData}
          edit={edition}
        />
      ) : (
        <></>
      )}
      {openDialogSettings ? (
        <SettingsForm
          open={openDialogSettings}
          onClose={handleOnCloseDialog}
          portList={porstList}
          onSubmitForm={onSubmitSettingsForm}
        />
      ) : (
        <></>
      )}
    </>
  );
}
