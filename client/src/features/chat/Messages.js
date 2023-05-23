import React from "react";
import Layout from "../../components/Layout";
import UserMessages from "../account/UserMessages";

const Messages = () => {
  return (
    <Layout>
      <h1 className="text-4xl font-bold p-4 text-black">Wiadomości</h1>
      <UserMessages />
    </Layout>
  );
};

export default Messages;
