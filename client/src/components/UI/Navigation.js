import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUnreadMessages } from "../../features/chat/chatSlice";

const Navigation = () => {
  const unreadMessages = useSelector(selectUnreadMessages);

  return (
    <div className="w-screen h-16 bg-green drop-shadow-xl z-10 mb-4 shadow-md">
      <div className="flex flex-row w-2/3 h-16 m-auto justify-between">
        <NavLink to="/" className="self-center ml-4">
          <div className="flex flex-col">
            <h1 className="text-center text-4xl font-bold text-white">WPO</h1>
          </div>
        </NavLink>
        <div className="flex flex-row gap-4 mr-4 self-center">
          <NavLink to="/user/chats">
            <button className="relative flex flex-row self-center border-2 border-green hover:border-white rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="self-center w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>

              <span className="text-white text-md font-bold p-3">
                Wiadomości
              </span>

              {unreadMessages > 0 ? (
                <h1
                  className="absolute h-5 w-5
                flex items-center justify-center top-0 right-0 bg-red-500 rounded-full text-white font-bold"
                >
                  {unreadMessages}
                </h1>
              ) : null}
            </button>
          </NavLink>
          <NavLink to="/user/favourite">
            <button className="self-center p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="self-center w-8 h-8 text-white hover:fill-black hover:text-red-500"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </NavLink>
          <NavLink to="/user/account">
            <button className="flex flex-row self-center border-2 border-green hover:border-white rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="self-center w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="text-white text-md font-bold p-3">
                Twoje konto
              </span>
            </button>
          </NavLink>
          <NavLink to="/user/new-ad">
            <button className="bg-darkGreen text-white text-md font-bold p-3 rounded-md border-2 border-darkGreen hover:border-white">
              Dodaj ogłoszenie
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
