import { UserProvider } from "./contexts/UserContext.jsx";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/AppRoutes";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </UserProvider>
  );
}

export default App;
