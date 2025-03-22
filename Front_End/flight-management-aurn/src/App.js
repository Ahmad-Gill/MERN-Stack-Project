import './componentCssFiles/App.scss';
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './componentsHtmlFIles/home';
import NavBar from "./componentsHtmlFIles/naveBar";
import CustomizeProfile from "./componentsHtmlFIles/customizeProfile";
import { UserProvider } from "./componentsHtmlFIles/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./componentsHtmlFIles/Footer";



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
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
