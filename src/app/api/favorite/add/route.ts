import connect from "../../../../utils/db";
import Pokemon from "../../../../models/Pokemon";
import User from "../../../../models/Users";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
  await connect();

  try {
    const { pokemonId, name } = await req.json();
    const user = await User.findOne({ name: name });

    if (!user) {
      return new NextResponse("No user found", { status: 404 });
    }

    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      return new NextResponse("Pokemon not found", { status: 404 });
    }

    if (user.favorites.includes(pokemonId)) {
      // If the Pokemon is already in the favorites, remove it
      user.favorites = user.favorites.filter((id:string) => id.toString() !== pokemonId);
      await user.save();
      return new NextResponse("Pokemon removed from favorites", { status: 201 });
    } else {
      // If the Pokemon is not in the favorites, add it
      user.favorites.push(pokemonId);
      await user.save();
      return new NextResponse("Pokemon added to favorites", { status: 200 });
    }
  } catch (error) {
    console.error("Error toggling Pokemon in favorites:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
