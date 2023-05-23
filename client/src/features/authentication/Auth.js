import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";

const Auth = ({ login }) => {
  const [isLogin, setIsLogin] = useState(login);
  const navigate = useNavigate();

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-b from-lightCyan to-wheat flex flex-row">
      <h1 className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-32xl font-bold text-white">
        WPO
      </h1>
      <div className="flex flex-col w-96 m-auto rounded bg-white border border-black self-center z-10">
        <div className="flex flex-row w-full">
          <button
            className={`w-1/2 h-12 ${
              isLogin
                ? "border-b-2 border-black text-black font-bold bg-amber-100"
                : "border-b border-gray-400 text-gray-400"
            }`}
            onClick={() => {
              setIsLogin(true);
              navigate("/login");
            }}
          >
            Zaloguj się
          </button>
          <button
            className={`w-1/2 h-12 ${
              !isLogin
                ? "border-b-2  border-black text-black font-bold bg-amber-100"
                : "border-b border-gray-400 text-gray-400"
            }`}
            onClick={() => {
              setIsLogin(false);
              navigate("/signup");
            }}
          >
            Załóż konto
          </button>
        </div>
        {isLogin ? <Login /> : <SignUp />}
      </div>
    </div>
  );
};

export default Auth;
