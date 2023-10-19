import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Protected({ children }) {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);
  if (!auth.currentUser) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
}
