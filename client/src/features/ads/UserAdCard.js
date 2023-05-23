import React, { useState } from "react";
import Modal from "../../components/UI/Modal";
import { Link } from "react-router-dom";

const UserAdCard = ({ ad, onDeactivate, onEdit }) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  return (
    <div className="flex flex-col bg-white p-2 shadow-md ">
      {isAlertVisible && (
        <Modal>
          <div className="flex flex-col bg-white p-4">
            <h1 className="text-xl font-bold">
              Czy na pewno chcesz zakończyć ogłoszenie?
            </h1>
            <div className="flex flex-row justify-center gap-2 mt-4">
              <button
                className="bg-red-500 text-white font-bold px-8 py-2 rounded-md"
                onClick={() => {
                  onDeactivate(ad.id);
                  setIsAlertVisible(false);
                }}
              >
                Tak
              </button>
              <button
                className="bg-blue-500 text-white font-bold px-8 py-2 rounded-md"
                onClick={() => setIsAlertVisible(false)}
              >
                Nie
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="bg-white p-2 h-40 flex flex-row gap-2">
        <div className="flex flex-row h-36 w-60 bg-white self-center">
          <img
            src={ad.photos[0].url}
            alt={ad.title}
            className="object-cover w-full h-full max-w-none max-h-none self-center aspect-auto  m-auto"
          />
        </div>
        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-row justify-between w-full">
            <Link to={`/search-results/${ad.id}`} className="w-max">
              <h1 className="my-2 text-xl h-12 line-clamp-2 hover:underline">
                {ad.title}
              </h1>
            </Link>
            <h2 className="text-xl text-center font-bold">{ad.price} zł</h2>
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-gray-700">{ad.category}</span>
            <div className="flex flex-row justify-between">
              <h2 className="text-sm text-gray-500">
                {ad.city} - {ad.createdAt}
              </h2>
              <div className="flex flex-row gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500 self-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="text-xl text-center">{ad.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 p-4 pr-2 pb-2 w-full">
        <div className="flex flex-row gap-2 w-max float-right">
          <button
            className="px-4 py-2 bg-lightGreen text-white font-bold border border-black"
            onClick={() => onEdit(ad.id)}
          >
            Edytuj
          </button>
          <button
            className="px-4 py-2 bg-green text-white font-bold border border-black"
            onClick={() => setIsAlertVisible(true)}
          >
            Zakończ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAdCard;
