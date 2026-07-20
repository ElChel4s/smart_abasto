export const bdMercados = [
  { 
    id: 'm1', nombre: 'Mercado Rodríguez', zona: 'San Pedro', distancia: '1.2 km', img: '🏠', lat: -16.502, lng: -68.136,
    horario: '05:00 AM - 18:00 PM', dias: 'Lunes a Domingo (Feria Fuerte: Sábados)', servicios: ['Parqueo cercano', 'Comedor', 'Baños Públicos']
  },
  { 
    id: 'm2', nombre: 'Mercado Sopocachi', zona: 'Sopocachi', distancia: '2.5 km', img: '🏘️', lat: -16.512, lng: -68.125,
    horario: '07:00 AM - 17:00 PM', dias: 'Lunes a Domingo', servicios: ['Rampa de acceso', 'Baños Públicos']
  },
  { 
    id: 'm3', nombre: 'Mercado Lanza', zona: 'Centro', distancia: '0.8 km', img: '🏢', lat: -16.496, lng: -68.138,
    horario: '06:00 AM - 20:00 PM', dias: 'Lunes a Domingo', servicios: ['Parqueo Tarifado', 'Guardería', 'Comedor']
  },
];

export async function getMercados() {
  return bdMercados;
}

export async function getMercadoById(id: string) {
  return bdMercados.find(m => m.id === id);
}
