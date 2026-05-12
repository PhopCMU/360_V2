import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "material-symbols";
import App from "./App";

import Home from "./pages/home";
import Home_Board from "./pages/home_board";

import Signin from "./pages/signin";
import Board from "./pages/signin_board";

import Faculty from "./pages/faculty/page";
import Faculty_Board from "./pages/faculty/[board]/page";

import Hospital from "./pages/hospital/page";
import Hospital_Board from "./pages/hospital/[board]/page";

import Office from "./pages/office/page";
import Office_Board from "./pages/office/[board]/page";

import Sanbox from "./pages/sanbox/page";
import Sanbox_Board from "./pages/sanbox/[board]/page";
// import Sanbox_Board_Vmdh from "./pages/sanbox/[board]/vmdh/page";

import Authen from "./auth/page";
import { UserProvider } from "./context/UserContext";
import React from "react";

const ProtectedLayout = () => {
  return (
    <UserProvider>
      <App>
        <div className="w-full mx-auto p-6 sm:p-4">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/hospital" element={<Hospital />} />

            <Route path="/sanbox" element={<Sanbox />} />
            <Route path="/office" element={<Office />} />
            <Route path="/auth" element={<Authen />} />
          </Routes>
        </div>
      </App>
    </UserProvider>
  );
};

const ProtectedLayout_board = () => {
  return (
    <UserProvider>
      <App>
        <div className="w-full mx-auto p-6 sm:p-4">
          <Routes>
            <Route path="/home_board" element={<Home_Board />} />
            <Route path="/faculty" element={<Faculty_Board />} />
            <Route path="/hospital" element={<Hospital_Board />} />
            <Route path="/office" element={<Office_Board />} />

            <Route path="/sanbox" element={<Sanbox_Board />} />
            {/* <Route path="/sanbox/vmdh" element={<Sanbox_Board_Vmdh />} /> */}
          </Routes>
        </div>
      </App>
    </UserProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Signin />} />
        <Route path="/board" element={<Board />} />

        {/* Protected routes */}
        <Route path="/*" element={<ProtectedLayout />} />

        {/* Protected routes board */}
        <Route path="/board/*" element={<ProtectedLayout_board />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
