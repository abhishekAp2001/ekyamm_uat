import { toast } from "react-toastify";
import { CustomToast } from "@/components/CustomToast";

export const showSuccessToast = (message = "Success!") => {
  toast(<CustomToast type="success" message={message} />, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    closeButton: false,
    style: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #FFFFFF4D",
      color: "#FFFFFF4D",
      backdropFilter: "blur(10px)",
      boxShadow: "0 2 7 0 #0000000D",
      background: "none",
    },
  });
};

export const showErrorToast = (message = "Something went wrong!") => {
  toast(<CustomToast type="error" message={message} />, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    closeButton: false,
    style: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #FFFFFF4D",
      color: "#FFFFFF4D",
      backdropFilter: "blur(10px)",
      boxShadow: "0 2 7 0 #0000000D",
      background: "none",
    },
  });
};
