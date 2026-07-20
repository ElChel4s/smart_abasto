-- Create caseras table
CREATE TABLE caseras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  puesto TEXT,
  especialidad TEXT,
  calificacion NUMERIC(3, 1) DEFAULT 5.0,
  mercado_id UUID
);

-- Create productos table
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  icono TEXT,
  categoria TEXT
);

-- Create ofertas table
CREATE TABLE ofertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  precio NUMERIC(10, 2) NOT NULL,
  unidad TEXT NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  tendencia TEXT DEFAULT 'estable',
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  casera_id UUID REFERENCES caseras(id) ON DELETE CASCADE
);

-- Seed Data (Datos de prueba)

-- Insert caseras
INSERT INTO caseras (id, nombre, puesto, especialidad, calificacion) VALUES 
('11111111-1111-1111-1111-111111111111', 'Doña Rosita', 'N° 14 - Lácteos', 'Quesos y Lácteos', 4.8),
('22222222-2222-2222-2222-222222222222', 'Doña Carmen', 'N° 45 - Verduras', 'Verduras frescas', 4.5);

-- Insert productos
INSERT INTO productos (id, nombre, icono, categoria) VALUES 
('33333333-3333-3333-3333-333333333331', 'Papa Imilla', '🥔', 'Tubérculos'),
('33333333-3333-3333-3333-333333333332', 'Tomate Perita', '🍅', 'Verduras'),
('33333333-3333-3333-3333-333333333333', 'Choclo Tierno', '🌽', 'Verduras'),
('33333333-3333-3333-3333-333333333334', 'Zanahoria', '🥕', 'Verduras'),
('33333333-3333-3333-3333-333333333335', 'Queso Criollo', '🧀', 'Lácteos'),
('33333333-3333-3333-3333-333333333336', 'Leche Fresca', '🥛', 'Lácteos');

-- Insert ofertas
INSERT INTO ofertas (precio, unidad, producto_id, casera_id) VALUES 
(55.00, 'arroba', '33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111'),
(5.00, 'cuarta', '33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111'),
(12.00, 'docena', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
(3.00, 'cuartilla', '33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222222'),
(15.00, 'kilo', '33333333-3333-3333-3333-333333333335', '11111111-1111-1111-1111-111111111111'),
(6.00, 'litro', '33333333-3333-3333-3333-333333333336', '11111111-1111-1111-1111-111111111111');
