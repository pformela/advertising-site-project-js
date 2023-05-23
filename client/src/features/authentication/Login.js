import { Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import LoadingModal from "../../components/UI/LoadingModal";
import { userActions } from "../account/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const handleToggle = () => {
    setPersist(!persist);
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) errors.email = "Email is required";
          else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid e-mail address.";
          }
          if (!values.password) errors.password = "Password is required";
          if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i.test(
              values.password
            )
          )
            errors.password =
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number";

          return errors;
        }}
        onSubmit={async (values) => {
          let result;
          try {
            result = await login(values);
            if (result?.error?.data) {
              setErrMsg("Niepoprawny e-mail lub hasło");
            } else {
              dispatch(userActions.setCredentials(result?.data));
            }
          } catch (error) {
            setErrMsg(error.data);
          }

          if (result?.data?.token) {
            navigate(-1);
          }
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
          <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4">
            {errMsg && <div className="text-red-500 text-center">{errMsg}</div>}
            <div className="flex flex-col gap-2">
              <label htmlFor="email">E-mail</label>
              <input
                className="bg-lightWheat p-2"
                type="text"
                name="email"
                onChange={handleChange}
                value={values.email}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
              <label htmlFor="email">Hasło</label>
              <input
                className="bg-lightWheat p-2"
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
              />
              {errors.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
            </div>
            <div className="flex flex-row gap-2 self-center">
              <label htmlFor="persist" className="text-black">
                Pamiętaj mnie
              </label>
              <input
                type="checkbox"
                name="persist"
                checked={persist}
                onChange={handleToggle}
              />
            </div>
            <button
              className="py-2 bg-darkGreen text-white font-bold text-xl rounded-md"
              type="submit"
            >
              Zaloguj się
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
