import React from "react";

export default function IconLabel({
  text,
  children,
  className,
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${className} flex items-center gap-1 text-md`}>
      {children}
      <h4 className="text-md font-semibold mb">{text}</h4>
    </div>
  );
}
