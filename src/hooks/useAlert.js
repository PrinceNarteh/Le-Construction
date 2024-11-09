import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const useAlert = () => withReactContent(Swal);

export default useAlert;
