import "./componentCssFiles/App.scss";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./componentsHtmlFIles/home";
import NavBar from "./componentsHtmlFIles/naveBar";
import Analytics_consumer from "./componentsHtmlFIles/Analytics_consumer";
import CustomizeProfile from "./componentsHtmlFIles/customizeProfile";
import Sign_up from "./componentsHtmlFIles/SignUp";  
import { UserProvider } from "./componentsHtmlFIles/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./componentsHtmlFIles/Footer";
import Log_in from "./componentsHtmlFIles/LogIn";
import SupportChat from "./componentsHtmlFIles/SupportChat.js";
import JetTypes from "./componentsHtmlFIles/JetTypes";
import { Provider } from "react-redux";
import { store } from "./store";

const Layout = () => {
  const location = useLocation();
  const paths = ["/", "/LogIn"]; // Hide navbar & footer on these paths

  return (
    <>
      {!paths.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Sign_up />} />
        <Route path="/LogIn" element={<Log_in />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/customizeProfile" element={<CustomizeProfile />} />
        <Route path="/Analytics_consumer" element={<Analytics_consumer email="m.ahmadgill01@gmail.com"/>} />
        <Route path="/jet-types" element={<JetTypes />} />
      </Routes>
      <SupportChat />
      {!paths.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    document.title = "Aurn کھٹولا";
  }, []);

  return (
    <Provider store={store}>
      <UserProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </UserProvider>
    </Provider>
  );
};

export default App;
