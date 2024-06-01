"use client";
import pokemonTypeColors from "@/constant/pokemon/pokemonTypeColors";
import { IPokemonDetails } from "@/interface/pokemon/PokemonDetails.interface";
import { errorToast } from "@/utils/Toast";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSession } from "next-auth/react";
import SpinnerLoading from "@/components/common/dataLoader";
import Card from "@/components/common/Card";
import PokemonMetadata from "@/components/pokemon/PokemonMetadata";

export default function PokemonDetailsPage() {
  const { name } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState<IPokemonDetails>();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (name) {
      fetchData();
    }
  }, [name]);

  const fetchData = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      if (data) {
        let tempData: IPokemonDetails = {
          abilities: [],
          id: 0,
          image: "",
          name: "",
          stats: [],
          type: [],
          weight: 0,
          height: 0,
        };
        tempData.id = data.id;
        tempData.name = data.name;
        tempData.height = data.height;
        tempData.weight = data.weight;
        tempData.image = data.sprites.front_default;
        tempData.abilities = data.abilities.map((ability: any) => {
          return ability.ability.name;
        });
        tempData.stats = data.stats.map((st: any) => {
          let stat: { name: string; basicStat: number } = {
            name: st.stat.name,
            basicStat: st.base_stat,
          };
          return stat;
        });
        tempData.type = data.types.map((t: any) => {
          return t.type.name;
        });
        setPokemonDetails(tempData);
      }
    } catch (error) {
      errorToast("There was an error fetching the data.");
    }
  };

  const getPokemonTypeColor = (type: string) => {
    const typeColor = pokemonTypeColors.find((color) => color.type === type);
    return typeColor ? `${typeColor.bg} ${typeColor.text}` : "";
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/sign-in");
    }
  }, [session, sessionStatus]);

  if (sessionStatus === "loading") {
    return (
      <div className="bg-slate-200 min-w-screen flex flex-col min-h-screen justify-center items-center gap-10">
        <SpinnerLoading />
      </div>
    );
  }

  if (sessionStatus === "authenticated") {
    return (
      <div className="flex items-center justify-center bg-[#e13d48] w-full ">
        {pokemonDetails && (
          <div className=" flex flex-col items-center justify-center gap-10 w-full md:w-2/3 lg:w-2/3 p-6">
            <div className=" px-6 py-2 items-center border-b-2 border-gray-300">
              <h1 className=" text-white font-semibold text-3xl">
                {pokemonDetails?.name}{" "}
                <span className=" text-gray-300 text-3xl ml-3">
                  #0{pokemonDetails?.id}
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 w-full mx-3">
              <Card className=" h-full">
                <img
                  src={pokemonDetails?.image}
                  alt={pokemonDetails.name}
                  className=" h-full w-full object-contain"
                />
              </Card>
              <Card className=" bg-white h-full flex flex-col gap-4 p-4 rounded-lg md:col-span-2">
                <div className=" w-full grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                  <PokemonMetadata title={"ID"} value={pokemonDetails.id}/>
                  <PokemonMetadata title={"Name"} value={pokemonDetails.name}/>
                  <PokemonMetadata title={"Height"} value={pokemonDetails.height}/>
                  <PokemonMetadata title={"Weith"} value={pokemonDetails.weight}/>
                </div>
                <div className=" w-full items-start justify-start flex flex-col gap-1">
                  <h1 className=" text-xl text-black font font-semibold">
                    Ability
                  </h1>
                  <div className=" flex flex-row gap-2">
                    {pokemonDetails.abilities.map((ability) => {
                      return (
                        <p
                          key={ability}
                          className=" px-5 py-2 items-center rounded-xl border text-black font-normal text-lg"
                        >
                          {ability}
                        </p>
                      );
                    })}
                  </div>
                </div>
                <div className=" w-full items-start justify-start flex flex-col gap-1">
                  <h1 className=" text-xl text-black font font-semibold">
                    Type
                  </h1>
                  <div className=" flex flex-row gap-2">
                    {pokemonDetails.type.map((type) => {
                      return (
                        <div
                          key={type}
                          className={`px-5 py-2 items-center rounded-xl border ${getPokemonTypeColor(
                            type
                          )}`}
                        >
                          <p className="text-md font-normal text-lg">{type}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
              <Card className=" w-full flex-col items-start justify-start md:col-span-3 p-4">
              <p className=" text-xl mb-8  text-black font-semibold">Stats</p>
              <div className="flex flex-col gap-3 items-center justify-center">
                {pokemonDetails.stats.map((stat) => {
                  return (
                    <div
                      key={stat.name}
                      className=" flex flex-col md:flex-col lg:flex-row gap-1 lg:gap-3 w-full items-start lg:items-center lg:justify-center"
                    >
                      <p className=" text-lg font-normal text-black flex w-1/12">
                        {stat.name}
                      </p>
                      <ProgressBar
                        className=" w-11/12"
                        completed={stat.basicStat}
                        animateOnRender
                        bgColor="#e13d48"
                        customLabel={stat.basicStat.toString()}
                        labelAlignment="center"
                        baseBgColor="#dcd9d9"
                        maxCompleted={200}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
            </div>
            
          </div>
        )}
      </div>
    );
  }
}
