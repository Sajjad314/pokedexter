import connect from '@/utils/db';
import Pokemon from '@/models/Pokemon';
import { NextResponse } from 'next/server';
import User from "../../../../models/Users";


export async function POST(req: Request) {
  await connect();
  try {
    const { name,pokemonId } = await req.json();
    console.log(pokemonId,name);
    
    const user = await User.findOne({ name: name });
    if (!user) {
        return new NextResponse("No user found", { status: 404 });
    }
    const favoritePokemon = user.favorites.includes(pokemonId);
    if (!favoritePokemon) {
    return new NextResponse("Favorite Pokemon not found", { status: 201 });
    }
    return new NextResponse("Favorite Pokemon  found", { status: 200 });
  } catch (error) {
    console.error('Error getting favorite Pokemon:', error);
    return new NextResponse("ServerError", { status: 500 });
  }
  }
  