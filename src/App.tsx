import "./App.css";
import EnvManager from "@/config/EnvManager";
import TaBbarBottom from "@/components/TaBbarBottom";
import AppRouter from "@/router/index";
EnvManager.print();
function App() {
  return (
      <div className="app">
        <div className="body">
          <AppRouter />
        </div>
        <div className="bottom">
          <TaBbarBottom />
        </div>
      </div>
  );
}

export default App;
