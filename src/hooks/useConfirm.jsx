import { useState } from "react";
import Modal from "../components/shared/Modal";
import { useRef } from "react";

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState({
    title: "",
    message: "",
    confirmButtonLabel: "",
    confirmButtonColor: "",
    fullWidth: false,
  });
  const fn = useRef();

  const confirm = ({
    title = "",
    message = "",
    confirmButtonLabel = null,
    confirmButtonColor = null,
    fullWidth = false,
  }) => {
    setState({
      title,
      message,
      confirmButtonLabel: confirmButtonLabel ?? "Yes, Delete!",
      confirmButtonColor: confirmButtonColor ?? "bg-red-500",
      fullWidth,
    });
    return new Promise((resolve) => {
      setIsOpen(true);
      fn.current = (choice) => {
        if (choice) {
          resolve(choice);
        } else {
          resolve(choice);
          setIsOpen(false);
        }
      };
    });
  };

  // You could replace the Dialog with your library's version
  const ConfirmationDialog = () => (
    <Modal
      disableClickedOutside
      openModal={isOpen}
      closeModal={setIsOpen}
      fullWidth={state.fullWidth}
    >
      <div className="text-center mb-5">
        <h3 className="font-bold text-3xl">{state.title}</h3>
        <p className="text-lg text-gray-700 mt-2">{state.message}</p>
      </div>
      <div className="flex gap-5 items-center justify-center">
        <button
          className={`${state.confirmButtonColor} text-white px-5 py-2 rounded-md`}
          onClick={() => fn.current(true)}
        >
          {state.confirmButtonLabel}
        </button>
        <button
          className="bg-gray-400 py-2 px-5 rounded-md"
          onClick={() => fn.current(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
  return { ConfirmationDialog, confirm, setIsOpen, isOpen };
};

export default useConfirm;
