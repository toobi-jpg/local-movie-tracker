import { useState } from "react";

export default function ReleaseDate({ data, mediaHasAired }) {
  let release;
  if (data.release_date) {
    release = data.release_date;
  } else {
    release = data.first_air_date;
  }

  return (
    <div
      className={`absolute bottom-1 right-1 z-20 flex flex-col backdrop-blur-xs 
        opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out
        py-0.5 px-1.5 text-center rounded-md border 
        ${
          !mediaHasAired
            ? "border-orange-800/50 bg-black/30"
            : "border-green-800/50 bg-black/30"
        }`}
    >
      {!mediaHasAired ? (
        <h2 className="text-[0.6rem] font-medium small-text-shadow">Coming:</h2>
      ) : (
        <h2 className="text-[0.6rem] font-medium small-text-shadow">
          Released:
        </h2>
      )}
      <h2 className="text-[0.6rem] font-medium small-text-shadow">{release}</h2>
    </div>
  );
}
