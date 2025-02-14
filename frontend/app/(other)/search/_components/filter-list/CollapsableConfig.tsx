import React from "react";

export default function CollapsableConfig({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex my-2">
        <div className="text-lg font-semibold">{title}</div>
      </div>
      {children}
    </>
  );
}
