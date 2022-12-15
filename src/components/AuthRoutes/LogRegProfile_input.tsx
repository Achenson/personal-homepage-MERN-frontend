import React, { useState } from "react";

interface Props {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  preventCopyPaste: boolean;
  passwordInputType: "NEW" | "CURRENT" | null;
  passVisible: boolean | undefined;
}

function LogRegProfile_input(
  {
    inputValue,
    setInputValue,
    preventCopyPaste,
    passwordInputType,
    passVisible,
  }: Props,
  passedRef: React.LegacyRef<HTMLInputElement> | undefined
): JSX.Element {
  const [inputHover, setInputHover] = useState(false);

  return (
    <input
      ref={passedRef}
      type={(() => {
        if (!passwordInputType) {
          return "text";
        }
        if (passVisible) {
          return "text";
        } else {
          return "password";
        }
      })()}
      // autoComplete={passwordInputType === "NEW" ? "new-password" : undefined}
      autoComplete={((passwordInputType: "NEW" | "CURRENT" | null) => {
        if (passwordInputType === "NEW") return "new-password";
        if (passwordInputType === "CURRENT") return "current-password";
        return undefined;
      })(passwordInputType)}
      className="w-full pl-px border border-gray-200 h-7 hover:border-gray-300 transition-colors duration-150
       focus-1"
      style={{
        borderTopColor: `${inputHover ? "#9CA3AF" : "#D1D5DB"}`,
        transitionProperty:
          "background-color, border-color, color, fill, stroke",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
      }}
      onMouseEnter={() => {
        setInputHover(true);
      }}
      onMouseLeave={() => {
        setInputHover(false);
      }}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onCopy={(e) => {
        if (preventCopyPaste) {
          e.preventDefault();
          return;
        }
      }}
      onPaste={(e) => {
        if (preventCopyPaste) {
          e.preventDefault();
          return;
        }
      }}
      value={inputValue}
    />
  );
}

export default React.forwardRef(LogRegProfile_input);
