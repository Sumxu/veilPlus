import "./App.css";
import EnvManager from "@/config/EnvManager";
import TaBbarBottom from "@/components/TaBbarBottom";
import { useLocation } from "react-router-dom";

import AppRouter from "@/router/index";

EnvManager.print();
function App() {
  const location = useLocation();
  const showTab = ["/Home", "/Donate", "/My"].includes(location.pathname);
  const noLoginPage = !["/Home",'/'].includes(location.pathname);

  return (
      <div className="app">
        <div className="body">
          <AppRouter />
        </div>
        <div className="bottom">
        { showTab && <TaBbarBottom />}
        </div>
      </div>
  );
}

export default App;
