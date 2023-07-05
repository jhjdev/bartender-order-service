import { Route, Routes } from "react-router-dom";
import Orders from "../pages/Orders";
import AddOrder from "../pages/AddOrder";
import ErrorMessage from "../pages/ErrorPage";

const Router = () => {
  /* nesting routes*/
  return (
    <Routes>
      <Route path="/" element={<Orders />} />
      <Route path="/new-order/" element={<AddOrder />} />
      <Route path="*" element={<ErrorMessage />} />
    </Routes>
  );
};
export default Router;
