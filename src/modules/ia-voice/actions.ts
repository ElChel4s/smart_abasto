'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
// El usuario tiene razón, el modelo 3.1-flash-lite existe y es el óptimo.
const MODEL_NAME = 'gemini-3.1-flash-lite'; 

const buildSystemPrompt = (inventario: any[], maestros: any[]) => {
  return `
Eres un asistente experto para caseras (vendedoras de mercados) en La Paz, Bolivia.
La casera te informará qué productos han cambiado de precio, si llegaron nuevos productos, o si se agotaron.
Hablará en lenguaje coloquial boliviano, usando modismos locales o Aymara (ej: "cuartilla", "arroba", "wawa", "yapita").

INVENTARIO ACTUAL DE LA CASERA:
${JSON.stringify(inventario, null, 2)}

CATÁLOGO OFICIAL DE PRODUCTOS (Para añadir nuevos):
${JSON.stringify(maestros, null, 2)}

INSTRUCCIONES:
1. Analiza el mensaje (de voz o texto) de la casera.
2. Compara lo que dice con el INVENTARIO ACTUAL.
3. El campo "unidad" SOLO puede ser uno de los siguientes: "libra", "cuartilla", "arroba", "cuarta", "amarro", "kilo", "unidad", "docena", "carga", "litro". Si menciona otra cosa (ej: montón, balde), conviértelo a "unidad" u otra aproximada válida.
4. Si actualiza un precio o disponibilidad de un producto existente, modifícalo y márcale "aiUpdated": true.
5. Si menciona un producto que NO está en su inventario, búscalo en el CATÁLOGO OFICIAL. Si lo encuentras, añádelo a la lista con "isNew": true, su "producto_id" oficial, "icono" oficial, "producto" oficial, e inventa un "id" temporal (ej: "new_123"). Márcalo con "aiUpdated": true.
6. Si menciona un producto que NO ESTÁ NI EN SU INVENTARIO NI EN EL CATÁLOGO OFICIAL (es un producto totalmente nuevo), CREA el producto en la lista con "isNew": true, SIN "producto_id" (no lo incluyas), inventa un "icono" emoji que le quede bien, y pon el nombre en "producto". Márcalo con "aiUpdated": true.
7. Devuelve la LISTA COMPLETA del inventario final, incluyendo los productos que NO cambiaron (estos no deben tener "aiUpdated").

FORMATO DE SALIDA ESTRICTO:
Debes responder ÚNICAMENTE con un JSON Array válido. Ningún otro texto, sin \`\`\`json.
Ejemplo:
[
  { "id": "uuid-existente", "producto_id": "uuid-m", "producto": "Tomate", "precio": 4.5, "unidad": "kilo", "disponible": true, "aiUpdated": true },
  { "id": "new_123", "isNew": true, "producto_id": "uuid-nuevo", "producto": "Papa Imilla", "precio": 50, "unidad": "arroba", "disponible": true, "aiUpdated": true, "icono": "🥔" }
]
`;
};

export async function processCaseraInput(
  inputType: 'text' | 'audio',
  content: string, // texto o base64
  mimeType: string | null,
  inventarioActual: any[],
  productosMaestros: any[]
) {
  if (!apiKey) {
    throw new Error('No se ha configurado GEMINI_API_KEY en .env.local');
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.2, // Baja temperatura para mantener JSON estable
      responseMimeType: "application/json",
    }
  });

  const prompt = buildSystemPrompt(inventarioActual, productosMaestros);
  
  let result;
  
  try {
    if (inputType === 'text') {
      result = await model.generateContent([
        prompt,
        "Mensaje de la casera: " + content
      ]);
    } else {
      // Audio processing
      // Limpiamos el mimeType quitando el codec (ej: audio/webm;codecs=opus -> audio/webm)
      const cleanMimeType = mimeType ? mimeType.split(';')[0] : "audio/webm";
      result = await model.generateContent([
        prompt,
        "Escucha el siguiente audio de la casera y actualiza el inventario:",
        {
          inlineData: {
            data: content,
            mimeType: cleanMimeType
          }
        }
      ]);
    }

    const textResponse = result.response.text();
    const parsedData = JSON.parse(textResponse);
    return parsedData;

  } catch (error: any) {
    console.error("Error en Gemini AI:", error);
    throw new Error('Fallo al procesar la entrada con IA: ' + error.message);
  }
}

export async function processCaseraAudioForm(formData: FormData) {
  const content = formData.get('audioBase64') as string;
  const mimeType = formData.get('mimeType') as string;
  const inventarioActual = JSON.parse(formData.get('inventarioActual') as string);
  const productosMaestros = JSON.parse(formData.get('productosMaestros') as string);
  
  return processCaseraInput('audio', content, mimeType, inventarioActual, productosMaestros);
}
