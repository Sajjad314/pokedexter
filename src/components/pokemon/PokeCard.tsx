"client component";

import pokemonTypeColors from "@/constant/pokemon/pokemonTypeColors";
import Image from "next/image";
import { useEffect, useState } from "react";
import heart from '../../../public/heart.png'
import filledHeart from '../../../public/heart_fiiled.png'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { IPokemonResponse } from "@/interface/pokemon/pokemonResponse.interface";

export default function PokeCard({ pokemon,isFavoritePage }: { pokemon: IPokemonResponse,isFavoritePage?:boolean }) {
  const [types, setTypes] = useState<{ type: string; color: string }[]>([]);
  const { data: session } = useSession();
  const [favorite,setIsFavorite] = useState(false)
  const getPokemonTypeColor = (type: string) => {
    const typeColor = pokemonTypeColors.find((color) => color.type === type);
    return typeColor ? `${typeColor.bg} ${typeColor.text}` : "";
  };

  const handleFavoriteClick = async() =>{
    const pokemonId = pokemon._id;
    const name = session?.user?.name;
    
    try{
      const res = await fetch("/api/favorite/add",{
          method:"POST",
          headers: {
              "Content-Type":"application/json",
          },
          body: JSON.stringify({ name, pokemonId })
      });
      if(res.status === 200){
        setIsFavorite(true)
      }
      if(res.status === 201){
        setIsFavorite(false)
      }
  }catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  const checkIfFavorite = async() =>{
    const pokemonId = pokemon._id;
    const name = session?.user?.name;
    
    try{
      const res = await fetch(`/api/favorite/getOne`,{
          method:"POST",
          headers: {
              "Content-Type":"application/json",
          },
          body: JSON.stringify({ name,pokemonId })
      });
      if(res.status === 200){
        setIsFavorite(true)
      }
  }catch (error) {
      console.error('Error adding to favorites:', error);
      console.log('Error adding to favorites');
    }
  }

  useEffect(()=>{
    if(session?.user){
      checkIfFavorite();
    }
  },[session,pokemon])

  useEffect(() => {
    if (pokemon) {
      let tempTypes: { type: string; color: string }[] = [];
      pokemon.type.map((t) => {
        let tempColor = getPokemonTypeColor(t);
        tempTypes.push({ type:t, color: tempColor });
      });
      setTypes(tempTypes);
    }
  }, [pokemon]);

  return (
    <div className="relative flex flex-col gap-3 my-10 bg-purple-200 shadow-sm ">
      <Link  href={`/pokemon/${pokemon.name}`}>
      <img
        className="w-full object-cover"
        src={pokemon.image}
        alt="pokemon image"
      />
      </Link>

{!isFavoritePage && <div className="absolute top-2 right-2">
        <Image
          src={favorite?filledHeart :  heart}
          alt="heart icon"
          width={30}
          height={30}
          className="cursor-pointer"
          onClick={handleFavoriteClick}
        />
      </div>}
      <Link  href={`/pokemon/${pokemon.name}`}>
      <div className=" flex flex-row items-center justify-center gap-3 mx-auto w-full">
        {types &&
          types.map((type) => {
            return (
              <div
                key={type.type}
                className={`px-3 py-1 rounded-lg ${type.color}`}
              >
                <p className="text-md">{type.type}</p>
              </div>
            );
          })}
      </div>
      </Link>
      <Link  href={`/pokemon/${pokemon.name}`}>
      <div className=" flex flex-col gap-2 items-center  py-4 px-2">
        <h2 className=" text-lg text-black font-semibold text-center">
          {pokemon.name}
        </h2>
      </div>
      </Link>
    </div>
  );
}
