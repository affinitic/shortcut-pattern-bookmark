import { Tooltip, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const iconMapping = {
  add: AddIcon,
  download: FileDownloadIcon,
  upload: FileUploadIcon,
  edit: EditIcon,
  setting: SettingsIcon,
  delete: DeleteIcon,
  grab: MenuIcon,
  close: CloseIcon,
};

export const ButtonIcon = (props) => {
  const { onClick, className, name, color, title, id } = props;
  const Icon = iconMapping[name];
  const onClickProps = (data) => {
    onClick(data, id);
  };
  return (
    <Tooltip title={title} className={`tooltip ${className}`}>
      <IconButton
        className={`button`}
        aria-label={title}
        variant="outlined"
        onClick={onClickProps}
        color={color}
      >
        <Icon color={color} />
      </IconButton>
    </Tooltip>
  );
};
