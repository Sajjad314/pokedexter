import connect from '@/utils/db';
import Pokemon from '@/models/Pokemon';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { IPokemonDetails } from '@/interface/pokemon/PokemonDetails.interface';

const fetchWithRetry = async (url: string, retries: number = 3, delay: number = 1000): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
};

export async function GET(request: Request) {
  await connect();
  const response = await fetchWithRetry('https://pokeapi.co/api/v2/pokemon?limit=1302');
  const pokemons = response.results;

  const countInDB = await Pokemon.estimatedDocumentCount();

  if (countInDB !== pokemons.length) {
    // If the count does not match, fetch detailed data from the API
    const detailedPokemons: IPokemonDetails[] = await Promise.all(
      pokemons.map(async (pokemon: { url: string }) => {
        const data = await fetchWithRetry(pokemon.url);

        return {
          id: data.id,
          name: data.name,
          abilities: data.abilities.map((ability: any) => ability.ability.name),
          image: data.sprites.front_default,
          weight: data.weight,
          height: data.height,
          type: data.types.map((t: any) => t.type.name),
          stats: data.stats.map((st: any) => ({
            name: st.stat.name,
            basicStat: st.base_stat,
          })),
        } as IPokemonDetails;
      })
    );

    // Insert new Pokémon data into the database if it doesn't already exist
    for (const pokemon of detailedPokemons) {
      await Pokemon.updateOne({ id: pokemon.id }, pokemon, { upsert: true });
    }
  }

  // Parsing query parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const filter: any = {};
  if (search) {
    filter.name = new RegExp(search, 'i');
  }
  if (type) {
    filter.type = type;
  }

  const options = {
    sort: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    limit,
  };

  const [allPokemons, total] = await Promise.all([
    Pokemon.find(filter, null, options),
    Pokemon.countDocuments(filter),
  ]);

  return NextResponse.json({
    pokemons: allPokemons,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
