import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../chat/ChatWindow";
import { useParams } from "react-router-dom";
import { selectUser } from "./userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useGetSingleAdMutation } from "../ads/adApiSlice";
import { chatActions, selectActiveChat } from "../chat/chatSlice";
import { usePostMessageMutation } from "../chat/chatApiSlice";
import Layout from "../../components/Layout";
import { socket } from "../chat/SocketHandler";
import LoadingModal from "../../components/UI/LoadingModal";

const UserChatWindow = () => {
  const { chatId } = useParams();
  const adId = chatId.split("_")[0];
  const [ad, setAd] = useState({});

  const [input, setInput] = useState("");

  const user = useSelector(selectUser);
  const chat = useSelector(selectActiveChat);

  const [getSingleAd, { isLoading }] = useGetSingleAdMutation();
  const [sendMessage, { isLoading: isLoadingPost }] = usePostMessageMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    const createdAt = new Date().toString();

    try {
      const { data } = await sendMessage({
        userId: user.userId,
        receiverId: chat.recipient,
        adId,
        message: input,
        createdAt,
        chatId,
      });
    } catch (error) {
      console.log(error);
    }

    const message = {
      ad,
      roomId: chatId,
      username: user.email.split("@")[0],
      senderId: user.userId,
      receiverId: chat.recipient,
      message: input,
      createdAt: formatDate(createdAt),
    };

    socket.emit("sendMessage", {
      ad,
      roomId: chatId,
      username: user.email.split("@")[0],
      senderId: user.userId,
      receiverId: chat.recipient,
      message: input,
      createdAt: formatDate(createdAt),
      type: "receiver",
    });
    dispatch(chatActions.addMessage({ ...message, type: "sender" }));

    setInput("");
  };

  const fetchAd = async () => {
    try {
      const { data } = await getSingleAd({ id: adId });
      setAd({
        active: data[0].active,
        adId: data[0].adId,
        photoUrl: data[0].photoUrl,
        price: data[0].price,
        title: data[0].title,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (JSON.stringify(ad) === "{}") {
      fetchAd();
    }

    return () => {
      dispatch(chatActions.setActiveChat({}));
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      {(isLoading || isLoadingPost) && <LoadingModal />}
      {JSON.stringify(chat) === "{}" ? (
        <div className="w-full h-64 flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl">Wystąpił błąd przy wyszukiwaniu chatu</h1>
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
              !chat.ad?.active && "opacity-50"
            }`}
          >
            <div className="border border-black mr-2">
              <img
                src={chat.ad?.photoUrl}
                alt="ad"
                className="w-12 h-12 object-cover borded"
              />
            </div>
            <div className="flex flex-col justify-between">
              {chat.ad?.active ? (
                <Link
                  to={`/search-results/${chat.ad?.adId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h1 className="text-sm hover:underline">{chat.ad?.title}</h1>
                </Link>
              ) : (
                <div className="flex flex-row gap-2">
                  <div className="bg-gray-300 text-sm px-1 font-bold">
                    Nieaktywne
                  </div>
                  <h1 className="text-sm">{chat.ad?.title}</h1>
                </div>
              )}
              <h3 className="font-bold">{chat.ad?.price} zł</h3>
            </div>
          </div>
          <ul
            id="chatWindow"
            className="flex flex-col gap-2 p-4 w-full h-96 overflow-auto scrollbar flex-col-reverse"
          >
            {chat.messages.map((item, index) => {
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

export default UserChatWindow;
