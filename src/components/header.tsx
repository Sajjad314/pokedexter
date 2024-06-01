"use client";
import Image from "next/image";
import Link from "next/link";
import pokeIcon from "../../public/Pokedex.png";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import img from "../../public/person.jpg";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session }: any = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
  };
  const router = useRouter();

  return (
    <div className="bg-[#e13d48] text-neutral-100 border-b border-white">
      <div className="container mx-auto px-10 flex items-center justify-between py-4">
        <Link
          href="/"
          className=" flex flex-row gap-2 items-center justify-center"
        >
          <Image
            src={pokeIcon}
            alt="pokedex-icon"
            className=" h-8 w-8 object-cover"
          />
          <p className=" text-2xl text-white font-semibold">PokéDex</p>
        </Link>
        <div>
          {session ? (
            <div className="flex gap-4 items-center">
              <ul className="flex">
                <li className="relative">
                  <a
                    href="#"
                    className="flex items-center space-x-2"
                    onClick={toggleDropdown}
                  >
                    <Image
                      src={img}
                      alt="Profile"
                      className="rounded-full h-12 w-12"
                    />
                  </a>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-32 mt-2 bg-gray-200 rounded-md shadow-lg text-center flex flex-col gap-1">
                      <p onClick={()=>{router.push("/profile");setIsDropdownOpen(false)}} className="py-2 bg-white text-black cursor-pointer hover:bg-gray-100">
                        Profile
                      </p>
                      <p
                        onClick={() => signOut()}
                        className="py-2 bg-white text-black cursor-pointer hover:bg-gray-100"
                      >
                        Logout
                      </p>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-4 items-center mx-2">
              <Link href="/sign-up">Sign up</Link>
              <Link href="/sign-in">Login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
