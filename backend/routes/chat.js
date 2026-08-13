import express from 'express';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import Product from '../models/Product.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter: Max 5 messages per minute per IP
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { reply: "I'm receiving too many messages right now! Please wait a minute before sending another one. ⏳" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Chatbot won't work.");
      return res.status(500).json({ error: 'AI provider is not configured properly.' });
    }

    // 1. Fetch available products to inject into the AI context
    const products = await Product.find({}, 'name shortDesc price discountPrice skinType benefits category ingredients').lean();
    
    const productCatalog = products.map(p => 
      `- ${p.name} (Skin Type: ${p.skinType || 'All'}, Price: ₹${p.discountPrice || p.price}): ${p.shortDesc}. Benefits: ${p.benefits}`
    ).join('\n');

    // 2. Initialize the LLM
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-3-flash-preview',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.3, // Low temperature for more factual responses
    });

    // 3. Define the prompt
    const prompt = PromptTemplate.fromTemplate(`
You are a helpful and polite customer support AI assistant for "Vedalush", a premium organic skincare and soap brand. 

CRITICAL RULES:
1. Speak in very simple, easy-to-understand English. Avoid difficult words, jargon, or long, complex sentences. 
2. Keep your answers VERY short and to the point. Do not write long paragraphs. Use bullet points whenever possible so it is easy to read.
3. You must ONLY answer questions related to Vedalush, its products, organic skincare, skin types, and purchasing/contacting Vedalush.
4. If a user asks a question entirely unrelated to business, skincare, or Vedalush, politely decline.
5. If a user asks for contact details, provide the following:
   - WhatsApp: +91 9904765058 (link format: [WhatsApp Us](https://wa.me/919904765058))
   - Email: Hello@vedalush.com (link format: [Hello@vedalush.com](mailto:Hello@vedalush.com))
   - Studio Location: VILLA-184, Manipur Saptak, Ghuma, Gujarat 382115 (Google Maps: [Open Maps](https://maps.app.goo.gl/UVMmWmdc2MtJXTGD7))
6. If a user asks for product recommendations for a skin type, use the catalog below to suggest the best matches briefly.
7. If a user asks to compare products, provide a simple comparison based on benefits and skin types.

VEDALUSH PRODUCT CATALOG:
{catalog}

USER QUERY: {query}
    `);

    // 4. Create the chain
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // 5. Invoke the chain
    const response = await chain.invoke({
      catalog: productCatalog || "No products currently available.",
      query: message,
    });

    res.json({ reply: response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Sorry, I am having trouble connecting right now. Please try again later.' });
  }
});

export default router;
