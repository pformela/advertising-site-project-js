import { Outlet } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectIsAuthenticated } from "./authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "./Auth";
import LoadingModal from "../../components/UI/LoadingModal";
import { userActions } from "../account/userSlice";
import { useDispatch } from "react-redux";
import { socket } from "../chat/SocketHandler";

const PersistLogin = () => {
  const [persist] = usePersist();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [token] = useState(useSelector(selectCurrentToken));
  const effectRan = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const verifyRefreshToken = async () => {
    try {
      const { data } = await refresh();
      setTrueSuccess(true);
      dispatch(userActions.setUser(data));

      socket.auth = { userId: data.userId };
      socket.connect();

      socket.emit("startListeningForChats", { userId: data.userId });

      navigate(location.pathname, { replace: true });
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV === "development") {
      if (!token && persist) {
        verifyRefreshToken();
      }
    }
    return () => (effectRan.current = true);
    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist && isAuthenticated) {
    content = <Outlet />;
  } else if (isLoading) {
    content = <LoadingModal />;
  } else if (isError) {
    content = <Auth login={true} />;
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  } else {
    content = <Auth login={true} />;
  }

  return content;
};

export default PersistLogin;
