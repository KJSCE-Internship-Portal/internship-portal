import React, { useState } from "react";

export default function Modal() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notfication, setNotification] = useState('');
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="relative inline-block text-right ml-20">
        <button
          className="text-white font-bold text-2xl outline-none focus:outline-none"
          onClick={toggleDropdown}
        >
          <div class="relative m-6 inline-flex w-fit">
        <div
          class="absolute bottom-auto left-0 right-auto top-0 z-10 inline-block -translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-pink-700 p-2.5 text-xs"></div>
        <div
          class="flex items-center justify-center rounded-lg bg-white px-2 py-2 text-center text-white shadow-lg dark:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-10 w-10">
            <path
              fill-rule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clip-rule="evenodd" />
          </svg>
        </div>
      </div>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
            <button
              className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                toggleDropdown();
              }}
            >
              See All Notifications
            </button>
            </div>
        )}
      </div>
    </>
  );
}
