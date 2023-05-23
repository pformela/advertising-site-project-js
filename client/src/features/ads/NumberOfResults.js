import React from "react";

const NumberOfResults = ({ ads }) => {
  return (
    <div className="bg-lightWheat p-4">
      <p className="text-center text-xl font-bold">
        Znaleziono {ads.length} ogłoszeń
      </p>
    </div>
  );
};

export default NumberOfResults;
