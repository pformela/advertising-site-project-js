import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { chatActions } from "./chatSlice";

export const socket = io.connect("http://localhost:4000", {
  autoConnect: false,
});

const SocketHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("getMessage", (data) => {
      dispatch(chatActions.addMessage(data));
    });
    // eslint-disable-next-line
  }, []);

  return <Outlet />;
};

export default SocketHandler;
