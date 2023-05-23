import React, { useState } from "react";
import { Formik } from "formik";
import { useRegisterMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../components/UI/LoadingModal";
import { userActions } from "../account/userSlice";

const SignUp = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const refreshWindow = () => {
    window.location.reload();
  };

  return (
    <>
      {isLoading && <LoadingModal />}
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
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

          if (!values.confirmPassword)
            errors.confirmPassword = "Confirm password is required";
          else if (values.password !== values.confirmPassword)
            errors.confirmPassword = "Passwords do not match";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { token, phone, email, userId } = await register({
              email: values.email,
              password: values.password,
            }).unwrap();
            dispatch(setCredentials({ token }));
            dispatch(userActions.setUser({ email, phone, userId }));
            navigate("/");
            refreshWindow();
          } catch (err) {
            if (!err.status) {
              setErrMsg("No server response.");
            } else if (err.status === 400) {
              setErrMsg("Missing email or password");
            } else if (err.status === 401) {
              setErrMsg("Unauthorized");
            } else {
              setErrMsg(err.data?.message);
            }
            console.log(err);
          }
          setSubmitting(false);
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
              <label htmlFor="email">Potwierdź hasło</label>
              <input
                className="bg-lightWheat p-2"
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={values.confirmPassword}
              />
              {errors.confirmPassword && (
                <div className="text-red-500">{errors.confirmPassword}</div>
              )}
            </div>
            {errMsg && <div className="text-red-500 text-center">{errMsg}</div>}
            <button
              className="py-2 bg-darkGreen text-white font-bold text-xl rounded-md"
              onClick={() => {}}
              type="submit"
            >
              Zarejestruj się
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
