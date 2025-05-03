import "./componentCssFiles/App.scss";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./componentsHtmlFIles/home";
import NavBar from "./componentsHtmlFIles/naveBar";
import Analytics_consumer from "./componentsHtmlFIles/Analytics_consumer";
import Analytics_provider from "./componentsHtmlFIles/Analytics_provider";
import CustomizeProfile from "./componentsHtmlFIles/customizeProfile";
import Sign_up from "./componentsHtmlFIles/SignUp";
import { UserProvider } from "./componentsHtmlFIles/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./componentsHtmlFIles/Footer";
import Log_in from "./componentsHtmlFIles/LogIn";
import SupportChat from "./componentsHtmlFIles/SupportChat";
import JetTypes from "./componentsHtmlFIles/JetTypes";
import { Provider } from "react-redux";
import { store } from "./store";
import ProviderProfile from "./componentsHtmlFIles/providerProfile";
import AdminDashboard from "./componentsHtmlFIles/adminProfile";
import UpcomingFlights from "./componentsHtmlFIles/UpcomingFlights";
import UpcomingFlights_provider from "./componentsHtmlFIles/UpcomingFlights_provider";
import AuthContainer from "./componentsHtmlFIles/AuthContainer";
import Book_Now from "./componentsHtmlFIles/Book_tickets";
import Flight_Details from "./componentsHtmlFIles/Details";
import AddFlight from "./componentsHtmlFIles/Add_Flight";
import AnalyticsAdmin from "./componentsHtmlFIles/Analytics_admin";
import UpcomingFlights_admin from "./componentsHtmlFIles/UpcomingFlights_admin";
import AdminChart from "./componentsHtmlFIles/AdminChart";
import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = "523630008496-bvgmp495ipb48035p60qq59r0biplhaf.apps.googleusercontent.com";

const Layout = () => {
  const location = useLocation();
  const paths = ["/signup", "/login", "/auth"];

  return (
    <>
      {!paths.includes(location.pathname.toLowerCase()) && <NavBar />}
      <Routes>
        <Route path="/SignUp" element={<Sign_up />} />
        <Route path="/LogIn" element={<Log_in />} />
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthContainer />} />
        <Route path="/consumerProfile" element={<CustomizeProfile />} />
        <Route path="/adminProfile" element={<AdminDashboard />} />
        <Route path="/providerProfile" element={<ProviderProfile />} />
        <Route path="/Analytics_consumer" element={<Analytics_consumer />} />
        <Route path="/Analytics_provider" element={<Analytics_provider  />} />
        <Route path="/flights" element={<UpcomingFlights />} />
        <Route path="/UpcomingFlights_provider" element={<UpcomingFlights_provider />} />
        <Route path="/jet-types" element={<JetTypes />} />
        <Route path="/Book_tickets" element={<Book_Now />} />
        <Route path="/AdminChart" element={<AdminChart />} />
        <Route path="/AddFlight" element={<AddFlight />} />
        <Route path="/AnalyticsAdmin" element={<AnalyticsAdmin />} />
        <Route path="/UpcomingFlights_admin" element={<UpcomingFlights_admin />} />
        <Route
          path="/Details/:id/:flight/:airline/:departure/:departure_time/:departure_date/:destination/:boarding_time/:arrival_date"
          element={<Flight_Details />}
        />
      </Routes>
      {!paths.includes(location.pathname.toLowerCase()) && <SupportChat />}
      {!paths.includes(location.pathname.toLowerCase()) && <Footer />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    document.title = "Aurn کھٹولا";
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <UserProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </UserProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
