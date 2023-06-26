import React from "react";
import { useContext } from "react";
import { Context } from "./components/Context/Context";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = () => {

  const { user } = useContext(Context)

  return user.isLogged ? <Outlet/> : <Navigate to="/login"/>
};

export default ProtectedRoutes;