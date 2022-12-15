import React from "react";

interface Props {
  notification: string;
  notificationType: "error" | "confirmation";
}

function AuthNotification({
  notification,
  notificationType,
}: Props): JSX.Element {
  let colorClass: string;

  switch (notificationType) {
    case "confirmation":
      colorClass = "green-500";
      break;
    case "error":
      colorClass = "red-500";
      break;
  }

  return (
    <div className={` text-${colorClass}`}>
      <p>{notification}</p>
    </div>
  );
}

export default AuthNotification;
