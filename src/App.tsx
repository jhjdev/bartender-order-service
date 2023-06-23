import Router from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <main className="flex flex-col h-screen w-screen">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1">
            {/* <div className="flex bg-gray-300 h-16 p-4">Header</div> */}
            <div className="flex flex-1 overflow-y-auto px-4">
              <Router />
            </div>
          </div>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
