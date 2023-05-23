import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./components/HomePage";
import Auth from "./features/authentication/Auth";
import SessionExpired from "./features/authentication/SessionExpired";
import PersistLogin from "./features/authentication/PersistLogin";
import Loading from "./components/UI/Loading";
import UserAccount from "./features/account/UserAccount";
import PageNotFound from "./components/PageNotFound";
import NewAdForm from "./features/account/NewAdForm";
import SearchResults from "./features/ads/SearchResults";
import AdInfo from "./features/ads/AdInfo";
import FavouriteAds from "./features/account/FavouriteAds";
import EditAdForm from "./features/account/EditAdForm";
import ChatWindow from "./features/chat/ChatWindow";
import SocketHandler from "./features/chat/SocketHandler";
import UserChatWindow from "./features/account/UserChatWindow";
import Messages from "./features/chat/Messages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SocketHandler />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Auth login={true} />} />
        <Route path="signup" element={<Auth login={false} />} />
        <Route path="loading" element={<Loading />} />
        <Route path="search-results" element={<Outlet />}>
          <Route index element={<SearchResults />} />
          <Route path=":id" element={<AdInfo />} />
        </Route>
        <Route path="expired" element={<SessionExpired />} />
        <Route path="user" element={<PersistLogin />}>
          <Route path="chats" element={<Messages />} />
          <Route path="chats/:chatId" element={<UserChatWindow />} />
          <Route path="chat/:id/:userId" element={<ChatWindow />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="favourite" element={<FavouriteAds />} />
          <Route path="new-ad" element={<NewAdForm />} />
          <Route path="edit-ad" element={<EditAdForm />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
