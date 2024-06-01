import mongoose from 'mongoose';

const PokemonSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    abilities: { type: [String], required: true },
    image: { type: String, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    type: { type: [String], required: true },
    stats: [
      {
        name: { type: String, required: true },
        basicStat: { type: Number, required: true },
      },
    ],
});

export default mongoose.models.Pokemon || mongoose.model('Pokemon', PokemonSchema);
