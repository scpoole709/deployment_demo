import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import VideoPage from "./pages/VideoPage";
import Home from "./pages/Home";
import CanvasPage from "./pages/CanvasPage";

function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Playground Politique</h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/canvas">Graphics</NavLink>
          <NavLink to="songs">Songs</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="canvas" element={<CanvasPage />} />
          <Route path="songs" element={<VideoPage />} />
          <Route path="songs/:name" element={<VideoPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
