import { Navigate } from "react-router-dom";

interface ProtectedProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ isLoggedIn, children }) => {
  return isLoggedIn ? (
    <div>{children}</div> // Render children (AppWrapper)
  ) : (
    <Navigate to="/" replace /> // Redirect to login
  );
};

export default Protected;
