-- Limpiar tablas si existen (útil si se corre varias veces)
DROP TABLE IF EXISTS ofertas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS caseras CASCADE;
DROP TABLE IF EXISTS mercados CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 1. Tabla Usuarios (Para Registro/Login simulado del prototipo)
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- En un entorno real se debe hashear
  rol TEXT DEFAULT 'ciudadano', -- 'ciudadano' o 'casera'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabla Mercados
CREATE TABLE mercados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  zona TEXT,
  distancia TEXT,
  img TEXT,
  lat NUMERIC,
  lng NUMERIC,
  horario TEXT,
  dias TEXT,
  servicios TEXT[]
);

-- 3. Tabla Caseras
CREATE TABLE caseras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  puesto TEXT,
  especialidad TEXT,
  calificacion NUMERIC(3, 1) DEFAULT 5.0,
  mercado_id UUID REFERENCES mercados(id) ON DELETE SET NULL,
  horario TEXT DEFAULT '08:00 - 18:00',
  sector TEXT DEFAULT 'Sector General',
  metodos_pago TEXT[] DEFAULT '{"Efectivo", "QR"}',
  apadrinada BOOLEAN DEFAULT FALSE
);

-- 4. Tabla Productos
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  icono TEXT,
  categoria TEXT
);

-- 5. Tabla Ofertas
CREATE TABLE ofertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  precio NUMERIC(10, 2) NOT NULL,
  unidad TEXT NOT NULL,
  disponible BOOLEAN DEFAULT TRUE,
  tendencia TEXT DEFAULT 'estable',
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  casera_id UUID REFERENCES caseras(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA (Datos para el Prototipo)
-- ==========================================

-- Mercados
INSERT INTO mercados (id, nombre, zona, distancia, img, lat, lng, horario, dias, servicios) VALUES 
('11111111-0000-0000-0000-111111111111', 'Mercado Rodríguez', 'San Pedro', '1.2 km', '🏠', -16.502, -68.136, '05:00 AM - 18:00 PM', 'Lunes a Domingo (Feria Fuerte: Sábados)', '{"Parqueo cercano", "Comedor", "Baños Públicos"}'),
('22222222-0000-0000-0000-222222222222', 'Mercado Sopocachi', 'Sopocachi', '2.5 km', '🏘️', -16.512, -68.125, '07:00 AM - 17:00 PM', 'Lunes a Domingo', '{"Rampa de acceso", "Baños Públicos"}'),
('33333333-0000-0000-0000-333333333333', 'Mercado Lanza', 'Centro', '0.8 km', '🏢', -16.496, -68.138, '06:00 AM - 20:00 PM', 'Lunes a Domingo', '{"Parqueo Tarifado", "Guardería", "Comedor"}'),
('44444444-0000-0000-0000-444444444444', 'Mercado Achumani', 'Zona Sur', '6.5 km', '🏠', -16.538, -68.083, '07:00 AM - 18:00 PM', 'Lunes a Domingo', '{"Seguridad 24h", "Parqueo Amplio"}');

-- Caseras
INSERT INTO caseras (id, nombre, puesto, especialidad, calificacion, mercado_id, horario, sector, metodos_pago, apadrinada) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Doña Rosita', 'N° 14', 'Quesos y Lácteos', 4.8, '11111111-0000-0000-0000-111111111111', '07:00 - 15:00', 'Nave Central', '{"Efectivo", "Transferencia", "QR"}', FALSE),
('c2222222-2222-2222-2222-222222222222', 'Doña Carmen', 'N° 45', 'Verduras frescas', 4.5, '11111111-0000-0000-0000-111111111111', '08:00 - 18:00', 'Pasillo A', '{"Efectivo"}', TRUE),
('c3333333-3333-3333-3333-333333333333', 'Don Julio', 'N° 02', 'Carnes y Cortes', 4.9, '22222222-0000-0000-0000-222222222222', '06:00 - 14:00', 'Sector Carnes', '{"Efectivo", "QR"}', FALSE),
('c4444444-4444-4444-4444-444444444444', 'Doña Marta', 'N° 120', 'Frutas de Temporada', 4.7, '33333333-0000-0000-0000-333333333333', '08:00 - 19:00', 'Nave Superior', '{"Efectivo", "QR"}', TRUE),
('c5555555-5555-5555-5555-555555555555', 'Don Pedro', 'N° 30', 'Tubérculos', 4.6, '44444444-0000-0000-0000-444444444444', '07:00 - 16:00', 'Sector Papas', '{"Efectivo"}', FALSE);

-- Productos
INSERT INTO productos (id, nombre, icono, categoria) VALUES 
('f1111111-1111-1111-1111-111111111111', 'Papa Imilla', '🥔', 'Tubérculos'),
('f2222222-2222-2222-2222-222222222222', 'Tomate Perita', '🍅', 'Verduras'),
('f3333333-3333-3333-3333-333333333333', 'Choclo Tierno', '🌽', 'Verduras'),
('f4444444-4444-4444-4444-444444444444', 'Zanahoria', '🥕', 'Verduras'),
('f5555555-5555-5555-5555-555555555555', 'Queso Criollo', '🧀', 'Lácteos'),
('f6666666-6666-6666-6666-666666666666', 'Leche Fresca', '🥛', 'Lácteos'),
('f7777777-7777-7777-7777-777777777777', 'Carne de Res (Pulpa)', '🥩', 'Carnes'),
('f8888888-8888-8888-8888-888888888888', 'Pollo Entero', '🍗', 'Carnes'),
('f9999999-9999-9999-9999-999999999999', 'Manzana Verde', '🍏', 'Frutas'),
('f0000000-0000-0000-0000-000000000000', 'Plátano', '🍌', 'Frutas');

-- Ofertas
INSERT INTO ofertas (precio, unidad, producto_id, casera_id) VALUES 
-- Doña Rosita (Lácteos - Rodríguez)
(15.00, 'kilo', 'f5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111'),
(6.00, 'litro', 'f6666666-6666-6666-6666-666666666666', 'c1111111-1111-1111-1111-111111111111'),
-- Doña Carmen (Verduras - Rodríguez)
(5.00, 'cuarta', 'f2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222'),
(12.00, 'docena', 'f3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222'),
(3.00, 'cuartilla', 'f4444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222'),
(55.00, 'arroba', 'f1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222'),
-- Don Julio (Carnes - Sopocachi)
(38.00, 'kilo', 'f7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333'),
(14.50, 'kilo', 'f8888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333'),
-- Doña Marta (Frutas - Lanza)
(10.00, 'cuartilla', 'f9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444'),
(5.00, 'docena', 'f0000000-0000-0000-0000-000000000000', 'c4444444-4444-4444-4444-444444444444'),
-- Don Pedro (Tubérculos - Achumani)
(60.00, 'arroba', 'f1111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555'),
(20.00, 'cuartilla', 'f1111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555');

-- Un usuario demo
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Juan Perez', 'juan@ejemplo.com', '123456', 'ciudadano');

-- Deshabilitar RLS para el prototipo (permitir lectura/escritura anónima)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE mercados DISABLE ROW LEVEL SECURITY;
ALTER TABLE caseras DISABLE ROW LEVEL SECURITY;
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas DISABLE ROW LEVEL SECURITY;
