import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    activeChat: null,
    unreadMessages: 0,
    isChatsEmpty: false,
  },
  reducers: {
    addChat: (state, action) => {
      state.chats[action.payload.roomId] = {};
    },
    setChats: (state, action) => {
      const chats = JSON.parse(JSON.stringify(action.payload.chats));
      const username = action.payload.username;

      state.chats = Object.keys(chats).reduce((acc, chat) => {
        const chatNew = chats[chat];
        const lastIndex = chatNew.messages.length - 1;
        chatNew.recipient =
          chatNew.messages[lastIndex].receiverId === action.payload.userId
            ? chatNew.messages[lastIndex].senderId
            : chatNew.messages[lastIndex].receiverId;

        chatNew.username =
          chatNew.username !== username ? chatNew.username : username;

        return { ...acc, [chat]: chatNew };
      }, {});
    },
    addMessage: (state, action) => {
      const {
        ad,
        roomId,
        username,
        senderId,
        receiverId,
        message,
        createdAt,
        type,
      } = action.payload;

      if (type === "receiver") state.unreadMessages++;
      if (state.isChatsEmpty) state.isChatsEmpty = false;

      if (!(roomId in state.chats)) {
        state.chats[roomId] = {
          ad,
          username,
          recipient: type === "sender" ? receiverId : senderId,
          messages: [
            {
              message,
              createdAt,
              type,
            },
          ],
          unread: type === "sender" ? false : true,
        };
      } else {
        state.chats[roomId].messages = [
          {
            message,
            createdAt,
            type,
          },
          ...state.chats[roomId].messages,
        ];
        state.chats[roomId].unread = type === "sender" ? false : true;
      }

      const sortedKeys = Object.keys(state.chats).sort((a, b) => {
        const lastMessageA = state.chats[a].messages[0].createdAt;
        const lastMessageB = state.chats[b].messages[0].createdAt;
        return new Date(lastMessageB) - new Date(lastMessageA);
      });

      const sortedChats = {};
      sortedKeys.forEach((key) => {
        sortedChats[key] = state.chats[key];
      });

      state.chats = sortedChats;

      if (state.activeChat?.ad?.adId !== ad.adId) {
        state.activeChat = { ...state.chats[roomId] };
        state.activeChat.unread = type === "sender" ? false : true;
        state.chats[roomId].unread = type === "sender" ? false : true;
      } else {
        state.activeChat = { ...state.chats[roomId] };
      }
    },
    setActiveChat: (state, action) => {
      if (action.payload in state.chats) {
        state.activeChat = { ...state.chats[action.payload] };
        state.activeChat.unread = false;
        state.chats[action.payload].unread = false;
      } else {
        state.activeChat = { messages: [] };
      }
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessages = state.unreadMessages + 1;
    },
    resetUnreadMessages: (state) => {
      state.unreadMessages = 0;
    },
    setIsChatsEmpty: (state, action) => {
      state.isChatsEmpty = true;
    },
  },
});

export const selectChats = (state) =>
  state.chat?.chats ? state.chat?.chats : {};

export const selectChat = (state, roomId) =>
  state.chat?.chats[roomId] ? state.chat?.chats[roomId] : {};

export const selectActiveChat = (state) =>
  state.chat?.activeChat ? state.chat?.activeChat : {};

export const selectUnreadMessages = (state) => state.chat?.unreadMessages || 0;
export const selectIsChatsEmpty = (state) => state.chat.isChatsEmpty;

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
