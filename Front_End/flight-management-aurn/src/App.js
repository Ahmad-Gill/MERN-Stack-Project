import './componentCssFiles/App.scss';
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './componentsHtmlFIles/home';
import NavBar from "./componentsHtmlFIles/naveBar";
import CustomizeProfile from "./componentsHtmlFIles/customizeProfile";
import { UserProvider } from "./componentsHtmlFIles/UserContext";

function App() {
  useEffect(() => {
    document.title = "Aurn کھٹولا ";
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customizeProfile" element={<CustomizeProfile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
