import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ingredient from './models/Ingredient.js';
import { connectToDatabase } from './utils/db.js';

dotenv.config();

const ingredientData = {
  "Matcha": {
    origin: "Traditionally cultivated in Japan, now globally sourced for skincare.",
    traditionalUse: "Traditionally valued for its antioxidant properties and calming nature.",
    collectionProcess: "Shade-grown tea leaves are carefully hand-picked.",
    preparationProcess: "Leaves are steamed, dried, and stone-ground into a fine powder."
  },
  "Manjishtha": {
    origin: "Native to the mountainous regions of the Himalayas and Indian subcontinent.",
    traditionalUse: "Traditionally used in Ayurveda to promote a clear, radiant complexion.",
    collectionProcess: "Roots are carefully harvested after the plant matures.",
    preparationProcess: "Roots are dried in the shade and finely ground into a herbal powder."
  },
  "Kokum Butter": {
    origin: "Sourced from the Western Ghats region of India.",
    traditionalUse: "Traditionally valued in Indian wellness for its deep moisturizing properties.",
    collectionProcess: "Seeds are collected from the fruit of the Kokum tree.",
    preparationProcess: "Seeds are sun-dried, crushed, and pressed to extract the rich butter."
  },
  "Olive Oil": {
    origin: "Native to the Mediterranean basin.",
    traditionalUse: "Traditionally used in ancient skincare regimens to nourish and protect.",
    collectionProcess: "Ripe olives are harvested from established groves.",
    preparationProcess: "Cold-pressed to preserve essential vitamins and fatty acids."
  },
  "Grapeseed Oil": {
    origin: "Derived from the seeds of grapes, historically cultivated in the Mediterranean and Asia.",
    traditionalUse: "Traditionally valued for its lightweight, balancing hydration.",
    collectionProcess: "Seeds are collected following the grape harvest.",
    preparationProcess: "Cold-pressed to extract a light, antioxidant-rich oil."
  },
  "Rice Bran Oil": {
    origin: "Sourced from rice-growing regions across Asia.",
    traditionalUse: "Traditionally used in Asian beauty rituals to maintain soft, supple skin.",
    collectionProcess: "The nutrient-rich outer layer of the rice kernel is carefully separated.",
    preparationProcess: "Cold-pressed to extract an oil rich in vitamin E and antioxidants."
  },
  "Castor Oil": {
    origin: "Native to the tropical regions of India and East Africa.",
    traditionalUse: "Traditionally valued in Ayurveda for deep nourishment and skin protection.",
    collectionProcess: "Castor seeds are harvested from mature plants.",
    preparationProcess: "Cold-pressed to create a thick, highly moisturizing oil."
  },
  "Coconut Oil": {
    origin: "Cultivated in tropical coastal regions, especially in South India.",
    traditionalUse: "A staple in Ayurvedic tradition, traditionally used for cooling and cleansing.",
    collectionProcess: "Mature coconuts are carefully harvested by hand.",
    preparationProcess: "The fresh kernel is extracted and cold-pressed to yield pure oil."
  },
  "Ratanjyot": {
    origin: "Native to the Himalayan region and Northern India.",
    traditionalUse: "Traditionally used in Ayurveda to impart a soothing red hue and calm the skin.",
    collectionProcess: "Roots are ethically harvested from mature plants.",
    preparationProcess: "Roots are gently dried and infused into oils to release their properties."
  },
  "Sea Buckthorn": {
    origin: "Native to the harsh, high-altitude climates of the Himalayas.",
    traditionalUse: "Traditionally valued for its rich nutrient profile and rejuvenating properties.",
    collectionProcess: "Bright orange berries are carefully hand-picked during early autumn.",
    preparationProcess: "Berries are cold-pressed to extract a deeply nourishing oil."
  },
  "Avocado Oil": {
    origin: "Native to Central America, now cultivated in tropical and subtropical regions.",
    traditionalUse: "Traditionally used in ancient beauty practices to restore deep moisture.",
    collectionProcess: "Ripe avocados are selected and harvested by hand.",
    preparationProcess: "The rich flesh is cold-pressed to extract its deeply replenishing oil."
  },
  "Cocoa Butter": {
    origin: "Sourced from cacao trees native to the Amazon basin.",
    traditionalUse: "Traditionally valued for its ability to soften skin and lock in moisture.",
    collectionProcess: "Cacao pods are harvested, and the beans are carefully extracted.",
    preparationProcess: "Beans are fermented, roasted, and pressed to yield pure, rich cocoa butter."
  },
  "Yashtimadhu": {
    origin: "Native to the Mediterranean and parts of Asia, widely used in India.",
    traditionalUse: "Traditionally used in Ayurveda to balance skin tone and soothe redness.",
    collectionProcess: "The sweet roots are harvested from mature plants.",
    preparationProcess: "Roots are cleaned, sun-dried, and ground into a fine botanical powder."
  },
  "Jojoba Oil": {
    origin: "Native to the arid regions of North America.",
    traditionalUse: "Traditionally valued for closely mimicking the skin's natural sebum.",
    collectionProcess: "Jojoba seeds are collected from desert shrubs.",
    preparationProcess: "Cold-pressed to extract a lightweight, balancing liquid wax."
  },
  "Shea Butter": {
    origin: "Sourced from the Shea tree native to West Africa.",
    traditionalUse: "Traditionally used across generations for intensive skin hydration and protection.",
    collectionProcess: "Shea nuts are gathered after naturally falling from the tree.",
    preparationProcess: "Nuts are crushed, roasted, and kneaded by hand to produce rich butter."
  }
};

async function updateIngredients() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB via connectToDatabase');

    const ingredients = await Ingredient.find();
    for (let ing of ingredients) {
      const updateData = ingredientData[ing.name];
      if (updateData) {
        ing.origin = updateData.origin;
        ing.traditionalUse = updateData.traditionalUse;
        ing.collectionProcess = updateData.collectionProcess;
        ing.preparationProcess = updateData.preparationProcess;
        await ing.save();
        console.log(`Updated ${ing.name}`);
      }
    }
    console.log('Finished updating ingredients.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateIngredients();
