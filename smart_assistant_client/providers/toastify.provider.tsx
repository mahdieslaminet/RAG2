import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastifyProvider: React.FC<IChildren> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};
