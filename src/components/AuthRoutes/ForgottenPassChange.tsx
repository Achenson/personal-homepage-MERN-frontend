import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "urql";

import AuthNotification from "./AuthNotification";
import LogRegProfile_input from "./LogRegProfile_input";

import { ChangePasswordAfterForgotMutation } from "../../graphql/graphqlMutations";

import { useAuth } from "../../state/hooks/useAuth";

import { AuthDataPasswordChangeAfterForgot_i } from "../../utils/authDataType";
import { GlobalSettingsState } from "../../utils/interfaces";

interface Props {
  mainPaddingRight: boolean;
  scrollbarWidth: number;
  globalSettings: GlobalSettingsState;
}

function ForgottenPassChange({ globalSettings }: Props): JSX.Element {
  let navigate = useNavigate();
  let { token } = useParams();
  const uiColor = globalSettings.uiColor;

  const loginAttempt = useAuth((store) => store.loginAttempt);

  let firstFieldRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [notificationMessage, setNotificationMessage] = useState<null | string>(
    null
  );

  const [changePasswordAfterForgotMutResult, changePasswordAfterForgotMut] =
    useMutation<any, AuthDataPasswordChangeAfterForgot_i>(
      ChangePasswordAfterForgotMutation
    );

  const [passVisible, setPassVisible] = useState(false);

  useEffect(() => {
    if (firstFieldRef.current !== null) {
      firstFieldRef.current.focus();
    }
  }, []);

  function sendPasswordChangeLink() {
    if (newPassword === "") {
      setErrorMessage("Invalid password");
      setNotificationMessage(null);
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must contain at least 8 characters");
      setNotificationMessage(null);
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage("Password confirmation does not match");
      setNotificationMessage(null);
      return;
    }

    changePasswordAfterForgotMut({
      token: token as string,
      newPassword,
    }).then(
      (res) => {
        if (!res) {
          setErrorMessage("Server connection Error");
          return;
        }

        if (!res.data?.changePasswordAfterForgot?.userId) {
          if (res.data?.changePasswordAfterForgot?.error) {
            setErrorMessage(res.data?.changePasswordAfterForgot?.error);
            setNotificationMessage(null);
            return;
          }
          // if no specific error is received from the server, check graphql errors:
          if (res.error?.message === "[GraphQL] jwt expired") {
            // [GraphQL] jwt expired
            setErrorMessage("Session expired - redirecting...");
            setNotificationMessage(null);
            setTimeout(() => {
              navigate("/passforgot");
            }, 2500);
            return;
          }

          if (res.error?.message === "[GraphQL] jwt malformed") {
            // [GraphQL] jwt expired
            setErrorMessage("Invalid token url - redirecting...");
            setNotificationMessage(null);
            setTimeout(() => {
              navigate("/passforgot");
            }, 2500);
            return;
          }

          if (res.error) {
            console.log(res.error.message);
            setErrorMessage("Unknown server error");
            setNotificationMessage(null);
            return;
          }

          setErrorMessage("An unknown error has occured");
          setNotificationMessage(null);
          return;
        }

        setErrorMessage(null);
        setNotificationMessage("Password successfully changed. Logging in...");

        setTimeout(() => {
          loginAttempt(
            true,
            res.data.changePasswordAfterForgot.userId,
            res.data.changePasswordAfterForgot.token
          );
          navigate("/");
        }, 2500);
      },
      (err) => {
        console.log(err);
        setErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <>
      <div className="mt-3 mb-5 flex flex-col items-center">
        <div className="w-48">
          <p className="text-sky-600 text-sm mb-2">
            SmoothTabs password change
          </p>

          <div className="flex items-center justify-between">
            <p>New password</p>
            <button
              className="focus-1-offset"
              onClick={() => {
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
            ref={firstFieldRef}
            inputValue={newPassword}
            setInputValue={setNewPassword}
            preventCopyPaste={true}
            passwordInputType={"NEW"}
            passVisible={passVisible}
          />

          <p>Confirm new password</p>
          <LogRegProfile_input
            //   ref={firstFieldRef}
            inputValue={newPasswordConfirm}
            setInputValue={setNewPasswordConfirm}
            preventCopyPaste={true}
            passwordInputType={"NEW"}
            passVisible={passVisible}
          />
        </div>

        {errorMessage && (
          <AuthNotification
            notificationType="error"
            notification={errorMessage}
          />
        )}
        {notificationMessage && (
          <AuthNotification
            notificationType="confirmation"
            notification={notificationMessage}
          />
        )}
      </div>

      <div className="flex justify-center">
        <button
          className={`w-40 mt-1 border border-${uiColor} rounded-md px-1 pb-px hover:bg-${uiColor} hover:bg-opacity-50 transition-colors duration-150
                  focus:outline-none focus-visible:ring-1 ring-${uiColor}`}
          onClick={sendPasswordChangeLink}
        >
          Change password
        </button>
      </div>
    </>
  );
}

export default ForgottenPassChange;
