import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps{
    className?: string;
    children: React.ReactNode;
}

export default function Card({className,children}:CardProps){ 
  return ( 
    <div className={twMerge("bg-white rounded-lg border shadow-lg p-4",className)} > 
      {children}
    </div> 
  ) 
} 
