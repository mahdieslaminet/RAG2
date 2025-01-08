"use client";

import React, { ChangeEventHandler } from "react";
import { FieldError } from "react-hook-form";

import { classNames } from "@/utils/tools";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputLabel?: string | React.JSX.Element;
  inputIcon?: React.JSX.Element;
  inputClassName?: string;
  onChangeValue?: (_: string) => void;
  customInputClassNameForIcon?: string;
  placeholder?: string;
  hasForm?: boolean;
  additionalInputClass?: string;
  error?: FieldError;
}

export const TextInput: React.FC<ITextInputProps> = ({
  error,
  inputLabel,
  inputIcon,
  placeholder,
  onChangeValue,
  inputClassName,
  hasForm = false,
  additionalInputClass = "",
  customInputClassNameForIcon = "pl-7 pr-2.5",
  ...inputProps
}) => {
  const [value, setValue] = React.useState<string>("");

  const handleOnChangeValue: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setValue(value);
    if (!!onChangeValue && !!value) onChangeValue(value);
  };

  return (
    <div>
      {!!inputLabel &&
        (typeof inputLabel === "string" ? (
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {inputLabel}
          </label>
        ) : (
          inputLabel
        ))}
      <div className="relative mt-2 rounded-xl shadow-sm">
        {!!inputIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {inputIcon}
          </div>
        )}
        {hasForm ? (
          <input
            className={
              !!inputClassName
                ? inputClassName
                : classNames(
                    "block w-full rounded-xl border-0 py-1.5 text-gray-900",
                    "ring-1 ring-inset placeholder:text-gray-400",
                    "focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    !!inputIcon ? customInputClassNameForIcon : "px-2.5",
                    additionalInputClass,
                    !!error?.message
                      ? "ring-red-500 focus:ring-red-600"
                      : "ring-gray-300 focus:ring-indigo-600"
                  )
            }
            placeholder={placeholder}
            {...inputProps}
          />
        ) : (
          <input
            value={value}
            onChange={handleOnChangeValue}
            className={
              !!inputClassName
                ? inputClassName
                : classNames(
                    "block w-full rounded-xl border-0 py-1.5 text-gray-900",
                    "ring-1 ring-inset placeholder:text-gray-400",
                    "focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    !!inputIcon ? customInputClassNameForIcon : "px-2.5",
                    additionalInputClass,
                    !!error?.message
                      ? "ring-red-500 focus:ring-red-600"
                      : "ring-gray-300 focus:ring-indigo-600"
                  )
            }
            placeholder={placeholder}
            {...inputProps}
          />
        )}
      </div>
      {!!error?.message && (
        <p className="pt-xs text-xs text-red-600 font-medium">
          {error?.message}
        </p>
      )}
    </div>
  );
};
