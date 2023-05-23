import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import UserPanel from "./UserPanel";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./userSlice";
import { adActions } from "../ads/adSlice";
import { selectUserAds, selectIsUserAdsEmpty } from "../ads/adSlice";
import {
  selectChats,
  selectIsChatsEmpty,
  chatActions,
} from "../chat/chatSlice";
import { useGetUserAdsMutation } from "../ads/adApiSlice";
import { useGetMessagesMutation } from "../chat/chatApiSlice";
import LoadingModal from "../../components/UI/LoadingModal";

const UserAccount = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userAds = useSelector(selectUserAds);
  const isUserAdsEmpty = useSelector(selectIsUserAdsEmpty);

  const chats = useSelector(selectChats);
  const isChatsEmpty = useSelector(selectIsChatsEmpty);

  const [getUserAds, { isLoading }] = useGetUserAdsMutation();
  const [getUserMessages, { isLoading: isMessagesLoading }] =
    useGetMessagesMutation();

  const fetchUserMessages = async () => {
    try {
      const { data } = await getUserMessages({ userId: user.userId });
      dispatch(chatActions.setIsChatsEmpty(data?.length === 0 || true));
      dispatch(
        chatActions.setChats({
          chats: data,
          userId: user.userId,
          username: user.email.split("@")[0],
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserAds = async () => {
    try {
      const { data } = await getUserAds({ userId: user.userId });
      dispatch(adActions.setIsUserAdsEmpty(data.length === 0));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userAds?.length === 0 && !isUserAdsEmpty) {
      fetchUserAds();
    }
    if (JSON.stringify(chats) === "{}" && !isChatsEmpty) {
      fetchUserMessages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {(isLoading || isMessagesLoading) && <LoadingModal />}
      <UserPanel />
    </Layout>
  );
};

export default UserAccount;
