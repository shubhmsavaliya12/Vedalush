import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  origin: {
    type: String,
    trim: true,
  },
  traditionalUse: {
    type: String,
    trim: true,
  },
  collectionProcess: {
    type: String,
    trim: true,
  },
  preparationProcess: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);

export default Ingredient;
