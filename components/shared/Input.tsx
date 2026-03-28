import React from "react";

const Input = ({
  placeholder,
  name,
  value,
  setValue,
}: {
  placeholder: string;
  name: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type="text"
      className="w-full py-2 px-6 rounded-full bg-gray-300/50 text-sm outline-none"
      placeholder={placeholder}
      name={name}
    />
  );
};

export default Input;
