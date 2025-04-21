import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box relative">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none pr-10"
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          <div
            className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-slate-600"
            onClick={toggleShowPassword}
          >
            {showPassword ? <FaRegEye size={22} /> : <FaRegEyeSlash size={22} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
