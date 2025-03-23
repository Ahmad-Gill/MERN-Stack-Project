import './componentCssFiles/App.scss';
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './componentsHtmlFIles/home';
import NavBar from "./componentsHtmlFIles/naveBar";
import Analytics_consumer from "./componentsHtmlFIles/Analytics_consumer";
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
          <Route path="/Analytics_consumer" element={<Analytics_consumer  email="m.ahmadgill01@gmail.com"/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
