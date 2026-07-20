-- Agregar columnas faltantes a caseras
ALTER TABLE caseras ADD COLUMN IF NOT EXISTS horario TEXT DEFAULT '08:00 - 18:00';
ALTER TABLE caseras ADD COLUMN IF NOT EXISTS sector TEXT DEFAULT 'Sector General';
ALTER TABLE caseras ADD COLUMN IF NOT EXISTS metodos_pago TEXT[] DEFAULT '{"Efectivo", "QR"}';
ALTER TABLE caseras ADD COLUMN IF NOT EXISTS apadrinada BOOLEAN DEFAULT FALSE;

-- Actualizar algunos datos de prueba
UPDATE caseras SET 
  horario = '07:00 - 15:00', 
  sector = 'Nave Central', 
  metodos_pago = '{"Efectivo", "Transferencia", "QR"}' 
WHERE nombre = 'Doña Rosita';

UPDATE caseras SET 
  apadrinada = TRUE 
WHERE nombre = 'Doña Carmen';
