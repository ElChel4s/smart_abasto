'use server';

export async function processVoiceInputAction(text: string, currentInventory: any[]) {
  // Aquí se conectaría la API de Gemini de manera real
  // const geminiResponse = await aiService.generateJSON(text, currentInventory);
  
  // Para la demo, simulamos el procesamiento:
  console.log("Procesando en el servidor con IA:", text);
  
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      // Clona el inventario actual para el borrador
      let newDrafts = JSON.parse(JSON.stringify(currentInventory));
      
      // Reglas simuladas en base al dictado de la casera
      // "El tomate bajó a 4 bolivianos, la papa está a 50..."
      
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('tomate')) {
        let t = newDrafts.find((d: any) => d.producto.toLowerCase().includes('tomate'));
        if (t) { t.precio = 4.00; t.aiUpdated = true; }
      }
      
      if (lowerText.includes('papa')) {
        let p = newDrafts.find((d: any) => d.producto.toLowerCase().includes('papa'));
        if (p) { p.precio = 50.00; p.aiUpdated = true; }
      }
      
      if (lowerText.includes('choclo') && (lowerText.includes('acabó') || lowerText.includes('agotado'))) {
        let c = newDrafts.find((d: any) => d.producto.toLowerCase().includes('choclo'));
        if (c) { c.disponible = false; c.aiUpdated = true; }
      }
      
      if (lowerText.includes('cebolla')) {
        newDrafts.unshift({ 
          id: `new_${Date.now()}`, 
          isNew: true, 
          aiUpdated: true, 
          producto: 'Cebolla Nueva', 
          precio: 10.00, 
          unidad: 'cuartilla', 
          disponible: true, 
          icono: '🧅' 
        });
      }

      resolve(newDrafts);
    }, 2000); // 2 segundos de simulación IA
  });
}
