import Router from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <div className="flex h-screen fixed left-0 top-0">
          <Sidebar />
        </div>
        <div className="flex h-screen relative left-64 top-0 mt-6">
          <Router />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
