import { Route, Routes } from "react-router-dom";
import Orders from "../components/Orders";
import AddOrder from "../components/AddOrder";
import ErrorMessage from "../components/ErrorPage";

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
