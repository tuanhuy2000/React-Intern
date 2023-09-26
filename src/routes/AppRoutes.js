import { Route, Routes } from "react-router-dom";
import Home from "../components/Home/Home";
import Login from "../components/Account/Login";
import PrivateRoute from "./PrivateRoute";
import TableUsers from "../components/TableUsers/TableUsers";
import NotFound from "./NotFound";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <TableUsers />
            </PrivateRoute>
          }
        ></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
