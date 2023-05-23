import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import { selectUser } from "../account/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { chatActions, selectActiveChat } from "./chatSlice";
import { selectIsAuthenticated } from "../authentication/authSlice";
import { useNavigate } from "react-router-dom";
import {
  useCheckIfReceiverAndAdExistMutation,
  usePostMessageMutation,
} from "./chatApiSlice";
import LoadingModal from "../../components/UI/LoadingModal";
import { socket } from "../chat/SocketHandler";
import { Link } from "react-router-dom";
import "../../Scrollbar.css";

export const formatDate = (d) => {
  const date = new Date(d);
  const day = date.getDate();
  const month =
    date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${minutes} ${day}.${month}`;
};

const ChatWindow = () => {
  const { id: adId, userId: receiverId } = useParams();
  const [ad, setAd] = useState({});

  const [input, setInput] = useState("");

  const chat = useSelector(selectActiveChat);
  const user = useSelector(selectUser);

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [checkIfReceiverAndAdExist, { isLoadingCheck, error }] =
    useCheckIfReceiverAndAdExistMutation();

  const [sendMessage, { isLoading }] = usePostMessageMutation();

  const check = async () => {
    try {
      const result = await checkIfReceiverAndAdExist({
        adId,
        receiverId,
      });

      if (result?.error?.data?.message) {
        setErrMsg(result.error.data.message);
      } else {
        setAd(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createdAt = new Date().toString();

    try {
      await sendMessage({
        userId: user.userId,
        receiverId,
        adId,
        message: input,
        createdAt,
        chatId: adId + "_" + user.userId,
      });
    } catch (error) {
      console.log(error);
    }

    const message = {
      ad: {
        adId,
        title: ad.title,
        photoUrl: ad.photoUrl,
        price: ad.price,
        active: ad.active,
      },
      roomId: adId + "_" + user.userId,
      username: ad.username,
      senderId: user.userId,
      receiverId,
      message: input,
      createdAt: formatDate(createdAt),
    };

    socket.emit("sendMessage", {
      ad: {
        adId,
        title: ad.title,
        photoUrl: ad.photoUrl,
        price: ad.price,
        active: ad.active,
      },
      roomId: adId + "_" + user.userId,
      username: ad.username,
      senderId: user.userId,
      receiverId,
      message: input,
      createdAt: formatDate(createdAt),
      type: "receiver",
    });
    dispatch(chatActions.addMessage({ ...message, type: "sender" }));

    setInput("");
  };

  useEffect(() => {
    check();
    window.scrollTo(0, 0);
    dispatch(chatActions.setActiveChat(adId + "_" + user.userId));

    return () => {
      dispatch(chatActions.setActiveChat({}));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <Layout>
      {(isLoadingCheck || isLoading) && <LoadingModal />}
      {error ? (
        <div className="w-full h-64 flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl">{errMsg}</h1>
          <button
            className="px-4 py-2 bg-green text-white text-xl p-2 rounded-md"
            onClick={() => navigate(-1)}
          >
            Wróć do wyników wyszukiwania
          </button>
        </div>
      ) : (
        <div className="border-2 border-green rounded-xl">
          <div
            className={`flex flex-row border-b-2 border-gray-300 pb-2 m-2 ${
              !ad?.active && "opacity-50"
            }`}
          >
            <div className="border border-black mr-2">
              <img
                src={ad?.photoUrl}
                alt="ad"
                className="w-12 h-12 object-cover borded"
              />
            </div>
            <div className="flex flex-col justify-between">
              {ad?.active ? (
                <Link
                  to={`/search-results/${ad?.adId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h1 className="text-sm hover:underline">{ad?.title}</h1>
                </Link>
              ) : (
                <div className="flex flex-row gap-2">
                  <div className="bg-gray-300 text-sm px-1 font-bold">
                    Nieaktywne
                  </div>
                  <h1 className="text-sm">{ad?.title}</h1>
                </div>
              )}
              <h3 className="font-bold">{ad?.price} zł</h3>
            </div>
          </div>
          <ul
            id="chatWindow"
            className="flex flex-col gap-2 p-4 w-full h-96 overflow-auto scrollbar flex-col-reverse"
          >
            {chat?.messages?.map((item, index) => {
              return item.type === "sender" ? (
                <li key={index} className="flex flex-col self-end max-w-64">
                  <p className="p-2 rounded-xl w-max max-w-md text-white bg-green self-end overflow">
                    {item.message}
                  </p>
                  <span className="text-xs text-gray-400 self-end">
                    {item.createdAt}
                  </span>
                </li>
              ) : (
                <li key={index} className="flex flex-col self-start">
                  <p className="p-2 rounded-xl max-w-md w-max max-h-none text-white bg-lightGreen self-start">
                    {item.message}
                  </p>
                  <span className="text-xs text-gray-400 self-start">
                    {item.createdAt}
                  </span>
                </li>
              );
            })}
          </ul>
          <form
            onSubmit={handleSubmit}
            className="flex flex-row gap-2 bg-green rounded-md p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-2 py-1 rounded-xl w-full"
            />
            <button
              type="submit"
              className="bg-white px-6 py-1 font-bold rounded-xl"
            >
              Wyślij
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ChatWindow;
