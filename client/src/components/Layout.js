import React from "react";
import Navigation from "./UI/Navigation";

const Layout = (props) => {
  return (
    <div className="w-screen min-h-screen bg-white mb-12">
      <Navigation />
      <div className="w-2/3 m-auto flex flex-col gap-6">{props.children}</div>
    </div>
  );
};

export default Layout;
