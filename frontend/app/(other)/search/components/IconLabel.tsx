import React from "react";

export default function IconLabel({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 text-md">
      {children}
      <h4 className="text-md font-semibold mb">{text}</h4>
    </div>
  );
}
