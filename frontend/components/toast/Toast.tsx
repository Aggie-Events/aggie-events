"use client";
import { useEffect, useState } from "react";
import { MdClose, MdCheckCircle, MdError, MdInfo, MdWarning } from "react-icons/md";

export interface ToastType {
  id: number;
  message: string;
  type: string;
  fading: boolean;
}

export default function Toast({
  message,
  type,
  onCloseAction,
  fading,
}: {
  message: string;
  type: string;
  onCloseAction: () => void;
  fading: boolean;
}) {
  const [visible, setVisible] = useState(true);

  const getToastStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-400",
          text: "text-red-800",
          icon: <MdError className="text-red-400 text-xl" />,
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-400",
          text: "text-green-800",
          icon: <MdCheckCircle className="text-green-400 text-xl" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-400",
          text: "text-yellow-800",
          icon: <MdWarning className="text-yellow-400 text-xl" />,
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-400",
          text: "text-blue-800",
          icon: <MdInfo className="text-blue-400 text-xl" />,
        };
    }
  };

  const styles = getToastStyles();

  useEffect(() => {
    setVisible(!fading);
  }, [fading]);

  return (
    <div
      className={`
        z-[999] fixed right-4 bottom-4 
        flex items-center gap-3 
        px-4 py-3 rounded-lg shadow-lg border
        transform transition-all duration-300 ease-in-out
        ${styles.bg} ${styles.border} ${styles.text}
        ${!visible ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"}
        ${fading ? "animate-slide-out-right" : "animate-slide-in-right"}
      `}
    >
      {styles.icon}
      <p className="pr-4">{message}</p>
      <button
        onClick={onCloseAction}
        className={`
          p-1 rounded-full hover:bg-black/5 transition-colors
          absolute top-1 right-1
        `}
      >
        <MdClose className="text-lg" />
      </button>
    </div>
  );
}
