# 📋 Portal de Abasto Inteligente (Hackatón La Paz)

¡Bienvenido al **Portal de Abasto Inteligente**! Este ecosistema digital ha sido diseñado para la Hackatón de La Paz con el objetivo de empoderar a comerciantes locales ("caseras") y ciudadanos mediante una solución de abastecimiento inteligente y geolocalizado en tiempo real, de costo cero en infraestructura y alto impacto social.

La aplicación implementa un ecosistema **Multi-App** gestionado en un repositorio único, estructurado por dominios de negocio y optimizado para dispositivos móviles.

---

## 🚀 Stack Tecnológico y su Rol en el MVP

Para garantizar un Producto Mínimo Viable (MVP) sólido y de alto rendimiento, el proyecto utiliza las siguientes tecnologías clave:

1. **Next.js 15+ (App Router) & TypeScript**: Estructura base del proyecto. Permite segmentar el desarrollo en múltiples aplicaciones independientes sin duplicar código y utilizar **Server Actions** en lugar de APIs tradicionales.
2. **React 19**: Motor de la interfaz con un modelo híbrido: Server Components por defecto (SEO y seguridad) y Client Components (`"use client"`) solo para la interactividad.
3. **Supabase (PostgreSQL + Realtime)**: Motor de persistencia. Los canales de WebSockets nativos de **Supabase Realtime** actualizan los precios y alertas de stock de forma instantánea.
4. **Google Gemini API**: Procesamiento de Lenguaje Natural (NLP). Extrae esquemas JSON estructurados a partir del dictado de voz de las caseras, mapeando jerga local y unidades andinas (como *libra*, *arroba*, *cuartilla*).
5. **MapLibre GL JS + Stadia Maps**: Infraestructura de mapas vectoriales WebGL, totalmente de código abierto, evitando licencias costosas de Google Maps.
6. **Tailwind CSS (v4)**: Framework utilitario para diseño responsivo ágil y consistente.
7. **PWA (Progressive Web Apps)**: Integrado mediante `@ducanh2912/next-pwa`, permitiendo que los módulos se instalen como aplicaciones independientes en iOS/Android.

---

## 📂 Estructura del Proyecto (Arquitectura Multi-App & Dominios)

El repositorio está organizado utilizando **Grupos de Rutas** en Next.js para emular dos aplicaciones diferentes (`(app-ciudadano)` y `(app-casera)`) dentro de un único proyecto, además de organizar el código de negocio por dominios autocontenidos en `src/modules/`.

```text
smart-abasto/
├── src/
│   ├── app/                          # 🌐 CAPA DE ENRUTAMIENTO (Multi-App)
│   │   ├── page.tsx                  # Enrutador Raíz (Redirección por Rol)
│   │   │
│   │   ├── (app-ciudadano)/          # 🛒 APP 1: MÓDULO COMPRADOR (CIUDADANO)
│   │   │   ├── layout.tsx            
│   │   │   ├── page.tsx              # Vista: Mapa y Filtros (Precio, Reputación, Cercanía)
│   │   │   ├── lista/
│   │   │   │   └── page.tsx          # Vista: Enrutador Físico y Checklist Interactivo
│   │   │   └── comunidad/
│   │   │       └── page.tsx          # Vista: Formulario de feedback y quejas (Moderado por IA)
│   │   │
│   │   └── (app-casera)/             # 🎙️ APP 2: MÓDULO VENDEDOR (CASERA)
│   │       ├── layout.tsx            
│   │       ├── page.tsx              # Vista: Botón de Micrófono (Zero UI)
│   │       ├── perfil/
│   │       │   └── page.tsx          # Vista: Historial de productos cargados
│   │       └── reconocimientos/
│   │           └── page.tsx          # Vista: Reporte Mensual Cordial y Certificados
│   │
│   ├── components/                   # ⚛️ COMPONENTES ATÓMICOS (React Puro)
│   │   └── ui/                       # UI reutilizable
│   │
│   ├── modules/                      # 🧱 CAPA DE DOMINIOS (Lógica de Negocio)
│   │   ├── ia-voice/                 # 🎙️ Dominio: Motores IA (Dictado y Moderación)
│   │   │   ├── actions.ts            
│   │   │   ├── gemini-client.ts      
│   │   │   ├── system-prompt.ts      # Reglas para jergas andinas y conversión
│   │   │   ├── madrina-parser.ts     # Lógica IA para procesar dictado solidario doble
│   │   │   └── anti-toxic-parser.ts  # Filtro IA Empática (Convierte quejas agresivas en feedback constructivo)
│   │   │
│   │   ├── inventario/               # 🥕 Dominio: Gestión de Stock e Inventario
│   │   │   ├── components/           
│   │   │   ├── actions.ts            
│   │   │   └── repository.ts         
│   │   │
│   │   ├── mercados/                 # 🗺️ Dominio: Geolocalización y Mapas
│   │   │   ├── components/           
│   │   │   └── repository.ts         
│   │   │
│   │   ├── compras/                  # 🛒 Dominio: Canasta Inteligente ("Waze de Mercados")
│   │   │   ├── components/           # Estimador de Presupuesto Transparente
│   │   │   ├── waze-alerts.ts        # Alertas de stock agotado
│   │   │   └── routing-utils.ts      # Algoritmo de "Recorrido Limpio" paso a paso
│   │   │
│   │   ├── gobernanza/               # 🏛️ Dominio: Incentivos, Psicología Positiva y Sociología
│   │   │   ├── actions.ts            # Certificados tributarios digitales de descuento en patentes
│   │   │   ├── gamification.ts       # Generación de mensajes con psicología positiva
│   │   │   └── types.ts              
│   │   │
│   │   └── notificaciones/           # 🔔 Dominio: Alertas Web Push
│   │
│   ├── shared/                       # ⚙️ CAPA TRANSVERSAL
│   │   └── supabase/
│   │       └── client.ts             # Cliente de Supabase
│   │
│   └── public/                       # 📂 ASSETS Y MANIFIESTOS PWA
│       ├── manifest-ciudadano.json   
│       └── manifest-casera.json      
```

---

## 🛠️ Instrucciones de Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente de manera correcta:

### 1. Requisitos Previos
Asegúrate de tener instalados en tu máquina:
- [Node.js](https://nodejs.org/) (Versión 18.x, 20.x o superior)
- [npm](https://www.npmjs.com/) (Viene incluido con Node.js)
- Un proyecto en [Supabase](https://supabase.com/) configurado.

### 2. Clonar el Repositorio
```bash
git clone https://github.com/ElChel4s/smart_abasto.git
cd smart_abasto
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo `.env.example` y renómbralo a `.env.local` en la raíz del proyecto:
```bash
cp .env.example .env.local
```
Abre `.env.local` y edita las siguientes variables con las credenciales de tu proyecto de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica-de-supabase
```

### 4. Instalar Dependencias
Instala todas las dependencias del proyecto ejecutando:
```bash
npm install
```
*(Nota: Si encuentras problemas de resolución de dependencias por las versiones de los peers, puedes utilizar `npm install --legacy-peer-deps`)*

### 5. Iniciar el Servidor de Desarrollo
Levanta la aplicación localmente ejecutando:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 6. Compilación de Producción
Para compilar y optimizar la aplicación para producción:
```bash
npm run build
npm run start
```

---

## 🏛️ Gobernanza y Modelo Solidario (Inclusión Digital)

El proyecto incluye dos pilares fundamentales:
1. **Casera Madrina (`madrina-parser.ts`)**: Permite que las comerciantes con mayor destreza digital registren mediante voz los precios de sus vecinas de puesto (adultas mayores o personas que no manejan tecnología), integrándolas a la plataforma.
2. **Psicología Positiva y Gamificación (`gamification.ts`)**: En lugar de mostrar simples métricas, se generan reportes redactados cordialmente para motivar a las comerciantes y otorgarles un certificado digital que les servirá para obtener incentivos del Gobierno Municipal.
