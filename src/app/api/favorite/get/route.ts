import connect from '@/utils/db';
import Pokemon from '@/models/Pokemon';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { IPokemonDetails } from '@/interface/pokemon/PokemonDetails.interface';
import User from "../../../../models/Users";


export async function POST(req: Request) {
  await connect();
  try {
    const { name } = await req.json();
    const user = await User.findOne({ name: name });
    if (!user) {
        return new NextResponse("No user found", { status: 404 });
      }
      
      const favoritePokemonDetails = await Pokemon.find({
        _id: { $in: user.favorites },
      });
  
      return NextResponse.json({
        pokemons: favoritePokemonDetails,
      });
    } catch (error) {
      console.error("Error fetching favorite Pokemon details:", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }
  