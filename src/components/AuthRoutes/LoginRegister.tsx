import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import LogRegProfile_input from "./LogRegProfile_input";
import AuthNotification from "./AuthNotification";

import { LoginMutation, AddUserMutaton } from "../../graphql/graphqlMutations";

import { useAuth } from "../../state/hooks/useAuth";

import {
  AuthDataInput_i,
  AuthDataInputRegister_i,
} from "../../utils/authDataType";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
}

function LoginRegister({ globalSettings }: Props): JSX.Element {
  let navigate = useNavigate();
  const loginAttempt = useAuth((store) => store.loginAttempt);
  // notification happens after register, but is displayed in login window
  const loginNotification = useAuth((store) => store.loginNotification);
  const setLoginNotification = useAuth((store) => store.setLoginNotification);
  const setMessagePopup = useAuth((store) => store.setMessagePopup);

  const uiColor = globalSettings.uiColor;

  const [loginOrRegister, setLoginOrRegister] = useState<"login" | "register">(
    "login"
  );

  let firstFieldRef = useRef<HTMLInputElement>(null);
  let secondFieldRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [email_or_name, setEmail_or_name] = useState("");
  const [password, setPassword] = useState("");
  const [passwordForRegister, setPasswordForRegister] = useState("");
  const [passwordForRegisterConfirm, setPasswordForRegisterConfirm] =
    useState("");

  const [passVisible, setPassVisible] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<null | string>(
    null
  );

  const [registerErrorMessage, setRegisterErrorMessage] = useState<
    null | string
  >(null);

  const [loginMutResult, loginMut] = useMutation<any, AuthDataInput_i>(
    LoginMutation
  );

  const [addUserMutResult, addUserMut] = useMutation<
    any,
    AuthDataInputRegister_i
  >(AddUserMutaton);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (
      secondFieldRef.current !== null &&
      loginNotification === "User successfully registered"
    ) {
      secondFieldRef.current.focus();
    }
  }, [loginNotification]);

  let finalColorForImgBackgroundMode = uiColor;

  if (uiColor === "blueGray-400") {
    finalColorForImgBackgroundMode = "blueGray-700";
  }

  function loginValidation() {
    console.log("sth");
    setLoginNotification(null);

    if (email_or_name === "" || password === "") {
      // !!! change
      setLoginErrorMessage("Please fill out all fields");
      console.log("Email/username or password not provided");
      return;
    }

    console.log("name email provided");

    // diffent than in apollo!
    loginMut({
      email_or_name: email_or_name,
      password: password,
    }).then(
      (res) => {
        if (!res) {
          setLoginErrorMessage("Server connection Error");
          return;
        }

        if (res.error) {
          console.log(res.error.message);
          setLoginErrorMessage("Unknown server error");
          return;
        }

        if (!res.data?.login) {
          setLoginErrorMessage("An unknown error has occured");
          return;
        }

        if (res.data?.login?.error) {
          console.log(res.data.login.error);
          setLoginErrorMessage(res.data.login.error);
          return;
        }

        setLoginErrorMessage(null);

        loginAttempt(
          res.data?.login?.ok,
          res.data?.login?.userId,
          res.data?.login?.token
        );

        setMessagePopup("Login successful");

        navigate("/", { replace: true });
      },
      (err) => {
        console.log(err);
        setLoginErrorMessage("Server connection Error");
        return;
      }
    );
  }

  function registerValidation() {
    if (username === "") {
      setRegisterErrorMessage("Invalid username");
      return;
    }

    if (username.indexOf("@") > -1) {
      setRegisterErrorMessage("Invalid username - @ symbol is not allowed");
      return;
    }

    // if (email === "" || email.indexOf("@") === -1) {
    if (email === "" || !/.+@.+/.test(email)) {
      setRegisterErrorMessage("Invalid email");
      return;
    }

    if (passwordForRegister === "") {
      setRegisterErrorMessage("Invalid password");
      return;
    }

    if (passwordForRegister.length < 8) {
      setRegisterErrorMessage("Password must contain at least 8 characters");
      return;
    }

    if (passwordForRegister !== passwordForRegisterConfirm) {
      setRegisterErrorMessage("Password confirmation does not match");
      return;
    }

    addUserMut({
      name: username,
      email: email,
      password: passwordForRegister,
      // refetchQueries: [{ query: getStatsQuery }],
      // useMutation mutate function does not call `onCompleted`!
      // so onCompleted can only be passed to initial hook
      // workaround: useMutation returns a Promise
    }).then(
      (res) => {
        if (!res) {
          setRegisterErrorMessage("Server connection Error");
          return;
        }

        if (!res.data?.addUser?.id) {
          if (res.error) {
            console.log(res.error.message);
            setRegisterErrorMessage("Unknown server error");
            return;
          }

          if (res.data?.addUser?.error) {
            setRegisterErrorMessage(res.data?.addUser?.error);
            return;
          }

          setRegisterErrorMessage("An unknown error has occured");
          return;
        }

        setRegisterErrorMessage(null);
        setLoginErrorMessage(null);
        setLoginNotification("User successfully registered");
        setUsername("");
        setEmail("");
        setPasswordForRegister("");
        setPasswordForRegisterConfirm("");
        setEmail_or_name(username);
        setLoginOrRegister("login");
        return;
      },
      (err) => {
        console.log(err);
        setRegisterErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <div className="">
      <div className="mx-auto w-32 flex justify-between">
        <button
          onClick={() => {
            setLoginOrRegister("login");
            setLoginNotification(null);
            setLoginErrorMessage(null);
          }}
          className={`${
            loginOrRegister === "login"
              ? "cursor-default" +
                " " +
                "text-" +
                finalColorForImgBackgroundMode
              : "hover:text-opacity-50 cursor-pointer text-gray-400"
          } text-lg  focus-1-offset`}
          aria-label={"Login form"}
        >
          <span>Login</span>
        </button>

        <button
          className={`${
            loginOrRegister === "login"
              ? "hover:text-opacity-50 cursor-pointer text-gray-400"
              : "cursor-default" +
                " " +
                "text-" +
                finalColorForImgBackgroundMode
          } text-lg focus-1-offset`}
          onClick={() => {
            setLoginOrRegister("register");
            // setLoginNotification(null);
            setRegisterErrorMessage(null);
          }}
          aria-label={"Register form"}
        >
          Register
        </button>
      </div>

      {loginOrRegister === "login" ? (
        <form>
          <div className="mt-3 mb-5 flex flex-col items-center">
            <div className="w-48">
              <p>Email address / username</p>
              <LogRegProfile_input
                ref={firstFieldRef}
                inputValue={email_or_name}
                setInputValue={setEmail_or_name}
                preventCopyPaste={false}
                passwordInputType={null}
                passVisible={undefined}
              />
            </div>
            <div>
              <div className="mt-1 w-48">
                <div className="flex items-center justify-between">
                  <p>Password</p>
                  <button
                    className="focus-1-offset"
                    onClick={(e) => {
                      e.preventDefault()
                      setPassVisible(!passVisible);
                    }}
                    aria-label={"Show/hide password"}
                  >
                    <span className={`text-sm text-${uiColor}`}>
                      {passVisible ? "hide" : "show"}
                    </span>
                  </button>
                </div>
                <LogRegProfile_input
                  ref={secondFieldRef}
                  inputValue={password}
                  setInputValue={setPassword}
                  preventCopyPaste={true}
                  passwordInputType={"CURRENT"}
                  passVisible={passVisible}
                />
              </div>
            </div>
            {loginErrorMessage && (
              <AuthNotification
                notificationType="error"
                notification={loginErrorMessage}
              />
            )}
            {loginNotification && (
              <AuthNotification
                notificationType="confirmation"
                notification={loginNotification}
              />
            )}
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col -mb-1">
              <button
                className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                    focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
                onClick={(e) => {
                  e.preventDefault();
                  loginValidation();
                }}
              >
                Login
              </button>
              <button
                className={`mt-0.5 text-sm text-gray-400 hover:text-opacity-50 cursor-pointer  focus-1-offset`}
                onClick={(e) => {
                  e.preventDefault(); 
                  navigate("/passforgot");
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form action="">
          <div className="mt-3 mb-5 flex flex-col items-center">
            <>
              <div className="w-48">
                <p>Username</p>
                <LogRegProfile_input
                  inputValue={username}
                  setInputValue={setUsername}
                  preventCopyPaste={false}
                  passwordInputType={null}
                  passVisible={undefined}
                />
              </div>
              <div className="mt-1 w-48">
                <p>Email address</p>
                <LogRegProfile_input
                  inputValue={email}
                  setInputValue={setEmail}
                  preventCopyPaste={false}
                  passwordInputType={null}
                  passVisible={undefined}
                />
              </div>
            </>
            <div className={`mt-3`}>
              <div className="mt-1 w-48">
                <div className="flex items-center justify-between">
                  <p>Password</p>
                  <button
                    className="focus-1-offset"
                    onClick={(e) => {
                      e.preventDefault()
                      setPassVisible(!passVisible);
                    }}
                    aria-label={"Show/hide password"}
                  >
                    <span className={`text-sm text-${uiColor}`}>
                      {passVisible ? "hide" : "show"}
                    </span>
                  </button>
                </div>
                <LogRegProfile_input
                  ref={secondFieldRef}
                  inputValue={passwordForRegister}
                  setInputValue={setPasswordForRegister}
                  preventCopyPaste={true}
                  passwordInputType={"NEW"}
                  passVisible={passVisible}
                />
              </div>
              <div className="mt-1 w-48">
                <p>Confirm password</p>
                <LogRegProfile_input
                  inputValue={passwordForRegisterConfirm}
                  setInputValue={setPasswordForRegisterConfirm}
                  preventCopyPaste={true}
                  passwordInputType={"NEW"}
                  passVisible={passVisible}
                />
              </div>
            </div>
            {registerErrorMessage && (
              <AuthNotification
                notificationType="error"
                notification={registerErrorMessage}
              />
            )}
          </div>
          <div className="flex justify-center">
            <button
              className={`w-24 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                      focus:outline-none focus-visible:ring-1 ring-${uiColor}
                      `}
              onClick={(e) => {
                e.preventDefault();
                registerValidation();
              }}
            >
              Register
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginRegister;
