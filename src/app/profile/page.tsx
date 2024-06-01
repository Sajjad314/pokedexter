"use client";
import PokeCard from "@/components/pokemon/PokeCard";
import { IPokemonDetails } from "@/interface/pokemon/PokemonDetails.interface";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { pokemonTypes } from "@/constant/pokemon/filterOptions";
import { sortOptions } from "@/constant/pokemon/sortOption";
import { useSession } from "next-auth/react";
import img from "../../../public/person.jpg";
import Image from "next/image";
import { IPokemonResponse } from "@/interface/pokemon/pokemonResponse.interface";
import { useRouter } from "next/navigation";
import SpinnerLoading from "@/components/common/dataLoader";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function Home() {
  const [pokemon, setPokemon] = useState<IPokemonResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session, status: sessionSatatus } = useSession();
  const router = useRouter();

  const fetchFavoritePokimon = async () => {
    const name = session?.user?.name;
    try {
      const res = await fetch("/api/favorite/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (res.status === 200) {
        const reponse = await res.json();
        setPokemon(reponse.pokemons);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionSatatus === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [session, sessionSatatus]);

  useEffect(() => {
    if (session?.user) {
      setIsLoading(true);
      fetchFavoritePokimon();
    }
  }, [session]);

  if (sessionSatatus === "loading") {
    return (
      <div className="bg-slate-200 flex flex-col min-h-screen justify-center items-center gap-10">
        <SpinnerLoading />
      </div>
    );
  }

  if (sessionSatatus === "authenticated") {
    return (
      <div className="bg-[#e13d48] flex flex-col min-h-screen justify-center items-center gap-10">
        <div className="flex flex-col gap-2 items-center mt-10 text-white">
          <Image
            src={
              session?.user && session?.user.image ? session?.user.image : img
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold">
            {session?.user && session?.user.name}
          </h1>
          <p>
            {session?.user && session?.user.email}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 border-b-2 pb-3 px-3 text-white border-white">
          Favorite Pokémon
        </h2>
        {/* <div className="flex flex-row items-start justify-between w-2/3 mx-auto">
        <div className=" flex flex-row items-start justify-start gap-5 w-1/2">
          <Select
            options={pokemonTypes}
            onChange={handleTypeChange}
            isClearable
            placeholder="Filter by Type"
            className="w-1/3"
          />
          <Select
            options={sortOptions}
            onChange={handleSortChange}
            placeholder="Sort by"
            className="w-1/3"
          />
        </div>
        <div className="w-1/3 flex flex-row gap-2">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className=" border rounded-lg border-gray-500  px-4 py-2 "
          />
          <button
            onClick={() => {
              setPageNo(1);
              setPokemon([]);
              setUniqueIds(new Set())
              setSelectedSearchTerm(searchTerm);
            }}
            className=" px-4 rounded-md items-center bg-blue-500 text-white"
          >
            Search
          </button>
        </div>
      </div> */}
        {pokemon.length === 0 && !isLoading ? (
          <h1 className=" text-3xl font-bold text-gray-600 mt-10">
            No favorite pokemon yet
          </h1>
        ) : (
          <div className="w-2/3 grid grid-cols-1 lg:grid-cols-5 gap-3 md:grid-cols-2 sm:grid-cols-2">
            {pokemon.map((p, i) => {
              return (
                <Link key={i} href={`/pokemon/${p.name}`}>
                  <PokeCard pokemon={p} isFavoritePage={true} />
                </Link>
              );
            })}
          </div>
        )}
        {isLoading && <SpinnerLoading/>}
      </div>
    );
  }
}
