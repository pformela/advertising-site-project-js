import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { selectUser } from "./userSlice";
import { useSelector } from "react-redux";
import { useSendLogoutMutation } from "../authentication/authApiSlice";
import {
  useChangeUserDataMutation,
  useChangeUserPasswordMutation,
  useChangeUserEmailMutation,
  useDeleteUserMutation,
} from "../account/userApiSlice";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../components/UI/LoadingModal";
import Modal from "../../components/UI/Modal";
import AlertComponent from "../../components/UI/AlertComponent";

const Settings = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const refresh = () => {
    window.location.reload();
  };

  const [showChangePersonalData, setShowChangePersonalData] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const handlePositiveResult = () => {
    setIsAlertVisible(true);

    setTimeout(() => {
      setIsAlertVisible(false);
    }, 5000);
  };

  const [sendLogout] = useSendLogoutMutation();
  const [changeUserData, { isLoading: isLoadingData }] =
    useChangeUserDataMutation();
  const [changeUserPassword, { isLoading: isLoadingPass }] =
    useChangeUserPasswordMutation();
  const [changeUserEmail, { isLoading: isLoadingEmail }] =
    useChangeUserEmailMutation();
  const [deleteUser, { isLoading: isLoadingDelete }] = useDeleteUserMutation();

  return (
    <div className="flex flex-col justify-center bg-lightWheat w-full p-4 gap-4">
      {(isLoadingData ||
        isLoadingPass ||
        isLoadingEmail ||
        isLoadingDelete) && <LoadingModal />}
      {isAlertVisible && (
        <AlertComponent
          message={alertMessage}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
      {showDeleteUserModal && (
        <Modal>
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center">
              Czy na pewno chcesz usunąć konto?
            </h1>
            <div className="flex flex-row justify-center gap-2">
              <button
                className="py-2 px-8 bg-red-500 font-bold text-center text-white w-max self-center"
                onClick={async () => {
                  const { data } = await deleteUser({ userId: user.userId });
                  setAlertMessage(data.message);
                  handlePositiveResult();
                  await sendLogout();
                  navigate("/");
                  refresh();
                }}
              >
                Tak
              </button>
              <button
                className="py-2 px-8 bg-blue-500 font-bold text-center text-white w-max self-center"
                onClick={() => setShowDeleteUserModal(false)}
              >
                Nie
              </button>
            </div>
          </div>
        </Modal>
      )}
      <button
        className="py-4 px-8 rounded-xl bg-green font-bold text-center text-white w-max self-center mb-4"
        onClick={async () => {
          await sendLogout();
          navigate("/");
          refresh();
        }}
      >
        Wyloguj się
      </button>
      <div className="flex flex-col">
        <button
          className="flex flex-row justify-between w-full py-4 bg-green text-white font-bold rounded-xl"
          onClick={() => setShowChangePersonalData(!showChangePersonalData)}
        >
          <span className="px-4 self-center text-xl">Zmień dane osobowe</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mr-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={`${
                !showChangePersonalData
                  ? "M19.5 8.25l-7.5 7.5-7.5-7.5"
                  : "M4.5 15.75l7.5-7.5 7.5 7.5"
              }`}
            />
          </svg>
        </button>
        {showChangePersonalData && (
          <Formik
            initialValues={{
              firstName: user.firstName ? user.firstName : "",
              lastName: user.lastName ? user.lastName : "",
              phone: user.phone ? user.phone : "",
              city: user.city ? user.city : "",
            }}
            validationSchema={Yup.object({
              firstName: Yup.string()
                .min(3, "Imię musi mieć minimum 3 znaki")
                .max(15, "Imię musi mieć maksymalnie 15 znaków")
                .required("Pole wymagane"),
              lastName: Yup.string()
                .min(2, "Nazwisko musi mieć minimum 2 znaki")
                .max(30, "Musi mieć długość maksymalnie 30 znaków")
                .required("Pole wymagane"),
              phone: Yup.string()
                .length(9, "Numer telefonu musi mieć 9 znaków")
                .required("Pole wymagane"),
              city: Yup.string()
                .min(2, "Nazwa miasta musi mieć minimum 2 znaki")
                .max(30, "Nazwa miasta musi mieć maksymalnie 30 znaków")
                .required("Pole wymagane"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { data } = await changeUserData({
                  ...values,
                  userId: user.userId,
                });
                setAlertMessage(data.message);
                handlePositiveResult();
              } catch (error) {
                console.log(error);
              }
              setSubmitting(false);
            }}
          >
            {({
              values,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              errors,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4 bg-white rounded-xl"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.firstName && (
                      <span className="text-red-500">{errors.firstName}</span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">Imię</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="text"
                        placeholder="Imię"
                        value={values.firstName}
                        onChange={(e) =>
                          setFieldValue("firstName", e.target.value)
                        }
                      />
                    </div>
                  </label>
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.lastName && (
                      <span className="text-red-500">{errors.lastName}</span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">Nazwisko</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="text"
                        placeholder="Nazwisko"
                        value={values.lastName}
                        onChange={(e) =>
                          setFieldValue("lastName", e.target.value)
                        }
                      />
                    </div>
                  </label>
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.phone && (
                      <span className="text-red-500">{errors.phone}</span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">Numer telefonu</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="text"
                        placeholder="Numer telefonu"
                        value={values.phone}
                        onChange={(e) => setFieldValue("phone", e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.city && (
                      <span className="text-red-500">{errors.city}</span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">Miasto</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="text"
                        placeholder="Miasto"
                        value={values.city}
                        onChange={(e) => setFieldValue("city", e.target.value)}
                      />
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="py-2 mt-4 px-8 border border-black bg-green font-bold text-center text-white w-max self-center"
                  >
                    Zaktualizuj
                  </button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>
      <div className="flex flex-col">
        <button
          className="flex flex-row justify-between w-full py-4 bg-green text-white font-bold rounded-xl"
          onClick={() => setShowChangeEmail(!showChangeEmail)}
        >
          <span className="px-4 self-center text-xl">Zmień adres e-mail</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mr-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={`${
                !showChangeEmail
                  ? "M19.5 8.25l-7.5 7.5-7.5-7.5"
                  : "M4.5 15.75l7.5-7.5 7.5 7.5"
              }`}
            />
          </svg>
        </button>
        {showChangeEmail && (
          <Formik
            initialValues={{
              email: user.email ? user.email : "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Niepoprawny adres email")
                .required("Pole wymagane"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              if (values.email === user.email) {
                setAlertMessage(
                  "Podany adres e-mail jest już przypisany do tego konta"
                );
                handlePositiveResult();
                setSubmitting(false);
                return;
              }

              try {
                const { data } = await changeUserEmail({
                  ...values,
                  userId: user.userId,
                });
                setAlertMessage(data.message);
                handlePositiveResult();
              } catch (error) {
                console.log(error);
              }
              setSubmitting(false);
            }}
          >
            {({
              values,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              errors,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4 bg-white rounded-xl"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.email && (
                      <span className="text-red-500 text-md">
                        {errors.email}
                      </span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">E-mail</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="text"
                        placeholder="E-mail"
                        value={values.email}
                        onChange={(e) => setFieldValue("email", e.target.value)}
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="py-2 mt-4 px-8 border border-black bg-green font-bold text-center text-white w-max self-center"
                  >
                    Zaktualizuj
                  </button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>
      <div className="flex flex-col">
        <button
          className="flex flex-row justify-between w-full py-4 bg-green text-white font-bold rounded-xl"
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          <span className="px-4 self-center text-xl">Zmień hasło</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mr-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={`${
                !showChangeEmail
                  ? "M19.5 8.25l-7.5 7.5-7.5-7.5"
                  : "M4.5 15.75l7.5-7.5 7.5 7.5"
              }`}
            />
          </svg>
        </button>
        {showChangePassword && (
          <Formik
            initialValues={{
              password: "",
            }}
            validationSchema={Yup.object({
              password: Yup.string()
                .min(8, "Hasło musi mieć conajmniej 8 znaków")
                .required("Pole wymagane"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { data } = await changeUserPassword({
                  ...values,
                  userId: user.userId,
                });
                setAlertMessage(data.message);
                handlePositiveResult();
              } catch (error) {
                console.log(error);
              }
              setSubmitting(false);
            }}
          >
            {({
              values,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              errors,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-4 bg-white rounded-xl"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-xl flex flex-col w-full items-center">
                    {errors.password && (
                      <span className="text-red-500 text-md">
                        {errors.password}
                      </span>
                    )}
                    <div className="flex flex-row w-full items-center">
                      <span className="w-48">Hasło</span>
                      <input
                        className="border border-black p-2 w-full"
                        type="password"
                        placeholder="Hasło"
                        value={values.password}
                        onChange={(e) =>
                          setFieldValue("password", e.target.value)
                        }
                      />
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="py-2 mt-4 px-8 border border-black bg-green font-bold text-center text-white w-max self-center"
                  >
                    Zaktualizuj
                  </button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </div>
      <button
        className="py-2 mt-4 px-8 border-2 border-white rounded-xl bg-red-500 font-bold text-center text-white w-max self-center"
        onClick={async () => {
          setShowDeleteUserModal(true);
        }}
      >
        Usuń konto
      </button>
    </div>
  );
};

export default Settings;
