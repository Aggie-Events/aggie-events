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
      <form className="flex flex-col my-2">
        <div className="flex">
          <div className="text-lg font-semibold">{title}</div>
        </div>
        {children}
      </form>
    </>
  );
}
