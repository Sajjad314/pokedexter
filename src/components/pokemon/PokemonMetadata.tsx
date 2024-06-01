import React from "react";

interface CardProps {
  title: React.ReactNode;
  value: React.ReactNode;
}

export default function PokemonMetadata({ title, value }: CardProps) {
  return (
    <div className=" flex flex-col gap-2 items-start">
      <h1 className=" text-xl font-semibold text-center">{title}</h1>
      <div className=" bg-gray-100 px-5 py-2 items-center rounded-xl border w-full">
        <span className="text-xl font-normal">
          {value}
        </span>
      </div>
    </div>
  );
}
