// Estilos compartidos para ambas Apps (Casera + Ciudadano)
// Inyectados vía <style> tag en los layouts
export const organicMarketStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;500;700&display=swap');

  :root {
    --bg-maiz: #F8F4E6; 
    --bg-tarjeta: #FCFAF2; 
    
    --rojo-carmesi: #D32F2F; 
    --rojo-claro: #FFEBEE;
    
    --verde-palta: #388E3C; 
    --verde-claro: #E8F5E9;
    
    --dorado-gamlp: #D4AF37; 
    --dorado-claro: #FFF5D1;
    
    --texto-fuerte: #2D2422; 
    --texto-suave: #796661;
    --borde: #EADBCE;
  }

  body {
    background-color: #E0D8C3; 
    font-family: 'DM Sans', sans-serif;
    color: var(--texto-fuerte);
    -webkit-font-smoothing: antialiased;
  }

  .font-display { 
    font-family: 'Bricolage Grotesque', sans-serif; 
    letter-spacing: -0.02em;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scan {
    0% { top: 0; }
    50% { top: 100%; }
    100% { top: 0; }
  }

  @keyframes pulseRipples {
    0% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4); }
    70% { box-shadow: 0 0 0 15px rgba(212,175,55,0); }
    100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
  }

  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

  .anim-stagger > * {
    opacity: 0;
    animation: fadeUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .anim-stagger > *:nth-child(1) { animation-delay: 0.05s; }
  .anim-stagger > *:nth-child(2) { animation-delay: 0.1s; }
  .anim-stagger > *:nth-child(3) { animation-delay: 0.15s; }
  .anim-stagger > *:nth-child(4) { animation-delay: 0.2s; }
  .anim-stagger > *:nth-child(5) { animation-delay: 0.25s; }

  .pattern-rafia {
    background-color: var(--bg-maiz);
    background-image: 
      linear-gradient(45deg, rgba(212,175,55,0.03) 25%, transparent 25%, transparent 75%, rgba(212,175,55,0.03) 75%),
      linear-gradient(45deg, rgba(212,175,55,0.03) 25%, transparent 25%, transparent 75%, rgba(212,175,55,0.03) 75%),
      repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(211,47,47,0.08) 10px, rgba(211,47,47,0.08) 15px, transparent 15px, transparent 25px, rgba(56,142,60,0.06) 25px, rgba(56,142,60,0.06) 35px, transparent 35px, transparent 40px, rgba(211,47,47,0.05) 40px, rgba(211,47,47,0.05) 60px),
      repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(212,175,55,0.04) 12px, rgba(212,175,55,0.04) 16px, transparent 16px, transparent 24px, rgba(211,47,47,0.03) 24px, rgba(211,47,47,0.03) 28px);
    background-size: 8px 8px, 8px 8px, 100% 100%, 100% 100%;
    background-position: 0 0, 4px 4px, 0 0, 0 0;
  }

  .card-organic {
    background: var(--bg-tarjeta);
    border: 1px solid var(--borde);
    border-radius: 20px;
    box-shadow: 0 4px 20px -12px rgba(139, 115, 85, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .card-organic:active { transform: scale(0.98); }
  .card-organic.interactive:hover {
    transform: translateY(-2px);
    border-color: var(--dorado-gamlp);
    box-shadow: 0 12px 24px -10px rgba(212, 175, 55, 0.25);
  }

  .tab-slider-bg {
    background: var(--borde);
    border-radius: 12px;
    position: relative;
    padding: 4px;
    display: flex;
  }

  .ticket-edge {
    background: radial-gradient(circle, transparent 5px, var(--bg-maiz) 5.5px) repeat-x;
    background-size: 14px 12px;
    height: 12px;
  }

  .mic-listening { animation: pulseRipples 1.5s infinite; }

  .input-editable {
    border-bottom: 2px dashed var(--borde);
    transition: all 0.2s;
    background: transparent;
  }
  .input-editable:focus {
    border-bottom: 2px solid var(--verde-palta);
    outline: none;
    background: var(--verde-claro);
  }
`;
