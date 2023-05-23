import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectChats, chatActions } from "../chat/chatSlice";
import { Link } from "react-router-dom";

const UserMessages = () => {
  const chats = useSelector(selectChats);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(chatActions.resetUnreadMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col bg-lightWheat p-4 gap-2 w-full">
      {chats &&
        Object.keys(chats).map((chatId) => {
          if (JSON.stringify(chats[chatId]) === "{}") return null;
          return (
            <Link
              key={chatId}
              to={`/user/chats/${chatId}`}
              onClick={() => {
                dispatch(chatActions.setActiveChat(chatId));
              }}
            >
              <div
                className={`flex flex-col bg-white p-2 w-full ${
                  chats[chatId].unread
                    ? "border-2 border-darkGreen"
                    : "border-2 border-white"
                }`}
              >
                <div className="flex flex-row gap-2">
                  <div className="min-w-max self-center">
                    <img
                      src={chats[chatId].ad.photoUrl}
                      alt="ad"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-0 text-sm w-full">
                    <h1 className="font-bold">{chats[chatId].username}</h1>
                    <h2 className="text-clip">{chats[chatId].ad.title}</h2>
                    <h3
                      className={`text-sm italic ${
                        chats[chatId].unread && "font-bold"
                      }`}
                    >
                      {chats[chatId].messages[0].message.length > 50
                        ? chats[chatId].messages[0].message.slice(0, 50) + "..."
                        : chats[chatId].messages[0].message}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default UserMessages;
