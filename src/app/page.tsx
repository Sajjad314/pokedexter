"use client";
import PokeCard from "@/components/pokemon/PokeCard";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { pokemonTypes } from "@/constant/pokemon/filterOptions";
import { sortOptions } from "@/constant/pokemon/sortOption";
import { useSession } from "next-auth/react";
import { IPokemonResponse } from "@/interface/pokemon/pokemonResponse.interface";
import SpinnerLoading from "@/components/common/dataLoader";
import { useRouter } from "next/navigation";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function Home() {
  const [pokemon, setPokemon] = useState<IPokemonResponse[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [uniqueIds, setUniqueIds] = useState<Set<number>>(new Set());
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSearchTerm, setSelectedSearchTerm] = useState<string>("");
  const { data: session, status: sessionSatatus } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function fetchPokemons() {
    let url = `/api/pokemon?page=${pageNo}&limit=20`;
    if (selectedSort.length > 0) {
      url += `&sortBy=${selectedSort}&sortOrder=asc`;
    }
    if (selectedType) {
      url += `&type=${selectedType}`;
    }
    if (selectedSearchTerm.length > 0) {
      url += `&search=${selectedSearchTerm}`;
    }
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const data = await res.json();
        let tempPokemon: IPokemonResponse[] = [];
        data.pokemons.forEach((p: any) => {
          if (!uniqueIds.has(p.id)) {
            tempPokemon.push(p);
            uniqueIds.add(p.id);
          }
        });

        setPokemon((prevState) => [...prevState, ...tempPokemon]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
    const res = await fetch(url);
    const data = await res.json();

    let tempPokemon: IPokemonResponse[] = [];
    data.pokemons.forEach((p: any) => {
      if (!uniqueIds.has(p.id)) {
        tempPokemon.push(p);
        uniqueIds.add(p.id);
      }
    });

    setPokemon((prevState) => [...prevState, ...tempPokemon]);
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchPokemons();
  }, [pageNo, selectedType, selectedSort, selectedSearchTerm]); // Depend on pageNo

  const handleTypeChange = (selectedOption: any) => {
    setSelectedType(selectedOption ? selectedOption.value : null);
    setPokemon([]);
    setUniqueIds(new Set());
    setPageNo(1);
  };

  const handleSortChange = (selectedOption: any) => {
    setPokemon([]);
    setSelectedSort(selectedOption.value);
    setPageNo(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (sessionSatatus !== "authenticated") {
      router.replace("/sign-in");
    }
  }, [session, sessionSatatus]);

  if (sessionSatatus === "loading") {
    return (
      <div className="bg-slate-200 min-w-screen flex flex-col min-h-screen justify-center items-center gap-10">
        <SpinnerLoading />
      </div>
    );
  }

  if (sessionSatatus === "authenticated") {
    return (
      <div className="bg-slate-200 flex flex-col min-h-screen justify-start items-center gap-10">
        <div className=" mt-10 w-2/3">
          <h1 className=" text-black text-3xl text-center font-serif ">
            Unveil Pokémon wonders in a click. Your Pokedex: where every catch
            finds its niche.
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between w-11/12 md:w-2/3 px-5 md:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-5 w-full md:w-1/2">
            <Select
              options={pokemonTypes}
              onChange={handleTypeChange}
              isClearable
              placeholder="Filter"
              className="w-full md:w-1/3"
            />
            <Select
              options={sortOptions}
              onChange={handleSortChange}
              placeholder="Sort"
              className="w-full md:w-1/3"
            />
          </div>
          <div className="w-full md:w-1/3 flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border rounded-lg border-gray-500 px-4 py-2 w-full md:w-auto"
            />
            <button
              onClick={() => {
                setPageNo(1);
                setPokemon([]);
                setUniqueIds(new Set());
                setSelectedSearchTerm(searchTerm);
              }}
              className="px-4 rounded-md items-center bg-blue-500 text-white w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </div>
        {pokemon.length === 0 && !isLoading ? (
          <h1 className=" text-3xl font-bold text-gray-600 mt-10">
            No available pokemon with this specification
          </h1>
        ) : (
          <div className="w-2/3 grid grid-cols-1 gap-5 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {pokemon.map((p, i) => {
              return <PokeCard key={i} pokemon={p} />;
            })}
          </div>
        )}
        {isLoading && <SpinnerLoading />}
        {!isLoading && pokemon.length > 0 && (
          <button
            onClick={() => {
              setPageNo((prevState) => prevState + 1);
            }}
            className="bg-blue-600 text-white px-6 py-3 items-center justify-between rounded-lg mb-10"
          >
            See More Pokemon
          </button>
        )}
      </div>
    );
  }
}
