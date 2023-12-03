import { useId } from "react";

interface Props {
  label: string;
  value: string;
  name: string;
  [x: string]: any;
}

export default function InputRadio({ label, value, ...others }: Props) {
  const inputId = useId();

  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        value={value}
        id={inputId}
        className="w-4 h-4 text-primary-800 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        {...others}
      />
      <label htmlFor={inputId} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );
}
