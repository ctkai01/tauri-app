import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import Home from "./components/Home/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="h-screen">
      <ToastContainer />
      <div className="flex h-full text-xs bg-gray-100 pl-4">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="w-3/4">
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;
