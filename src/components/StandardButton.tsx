"use client";

import React from "react";

const StandardButton = () => {
  return (
    <button
      className="w-full py-4 rounded 
              bg-primary text-white shadow-black shadow-md hover:brightness-125 transition-[filter]
      btn-default-scale [--duration:150ms]"
    >
      Buy now
    </button>
  );
};

export default StandardButton;
