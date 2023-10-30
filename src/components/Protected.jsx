import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
// @ts-ignore
export default function Protected({ children }) {
  const user = auth.currentUser;
  if (user) {
    return children;
  }

  return <Navigate to="/login" />;
}
