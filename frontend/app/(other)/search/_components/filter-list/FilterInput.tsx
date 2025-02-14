import React from "react";

// type FilterInputProps = {
//   onChange?: (value: HTMLInputElement) => void;
//   onEnter?: () => void;
//   onSubmit?: (value: HTMLInputElement) => void;
//   defaultValue?: string;
// };

export default function FilterInput({
  onChange,
  value,
  ...props
}: {
  onChange: (value: HTMLInputElement) => void;
  value?: string;
}) {
  return (
    <input
      type="text"
      className="w-full p-1 border border-gray-300 outline-none focus:shadow-md ring-1 ring-black"
      // onKeyDown={(e) => {
      //   if (e.key === "Enter") {
      //   }
      // }}
      onChange={(e) => onChange(e.target)}
      value={value}
      {...props}
    />
  );
}
