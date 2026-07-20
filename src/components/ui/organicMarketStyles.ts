// Estilos compartidos para la App Casera (inyectados vía <style>)
export const organicMarketStyles = `
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
      linear-gradient(90deg, rgba(211,47,47,0.04) 0px, rgba(211,47,47,0.04) 4px, transparent 4px, transparent 12px, rgba(56,142,60,0.03) 12px, rgba(56,142,60,0.03) 24px, transparent 24px, transparent 28px, rgba(212,175,55,0.05) 28px, rgba(212,175,55,0.05) 32px, transparent 32px, transparent 40px),
      repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 12px);
    background-size: 40px 100%, 100% 24px;
  }

  .card-organic {
    background: #FFFEFC;
    border: 1px solid var(--borde);
    border-radius: 20px;
    box-shadow: 0 4px 20px -12px rgba(139, 115, 85, 0.15);
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
