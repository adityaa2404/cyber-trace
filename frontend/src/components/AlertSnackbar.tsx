import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertSnackbar({ open, message, onClose }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      <Alert onClose={onClose} severity="warning" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
