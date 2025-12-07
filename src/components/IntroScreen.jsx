import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle } from 'lucide-react';
import useSystemAudio from '@/components/useSystemAudio';

export default function IntroScreen({ onComplete, onReachFinalStep }) {
  const { playType, playAlert, playSuccess, playGlitch, playClick, initAudio } = useSystemAudio();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState('loading'); 
  // Steps: loading -> alert -> stats -> condition -> chance -> welcome -> unlock -> final
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [bootLines, setBootLines] = useState([]);

  // Boot sequence text
  useEffect(() => {
    if (step === 'loading' && hasStarted) {
      const lines = [
        "INITIALIZING_KERNEL...",
        "LOADING_NEURAL_INTERFACE...",
        "CHECKING_BIOMETRICS...",
        "SYNCING_WITH_DATABASE...",
        "ESTABLISHING_SECURE_CONNECTION...",
        "SYSTEM_READY."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < lines.length) {
            setBootLines(prev => [...prev.slice(-4), lines[i]]);
            i++;
        } else {
            clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [step, hasStarted]);

  const typeText = async (text, speed = 50) => {
    setTypedText('');
    for (let i = 0; i < text.length; i++) {
      setTypedText(prev => prev + text[i]);
      if (text[i] !== ' ') playType(); // Sound on non-space chars
      await new Promise(r => setTimeout(r, speed));
    }
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    if (!hasStarted) return;

    const sequence = async () => {
      // 1. Loading
      for (let i = 0; i <= 100; i += 2) {
        setProgress(i);
        if (i % 10 === 0) playType(); // Periodic tick
        await delay(20);
      }
      await delay(500);

      // 2. System Alert
      setStep('alert');
      playAlert();
      await delay(1500);

      // 3. Stats (Terminal)
      setStep('stats');
      await typeText("Jogador encontrado.\nNível atual: Iniciado.\nCompatibilidade: 97%.", 30);
      await delay(1000);

      // 4. Condition (Glitch)
      setStep('condition');
      playGlitch();
      await delay(100); // Fast glitch trigger

      // 5. Second Chance (Explosion)
      setStep('chance');
      playSuccess(); // Dramatic sound
      await delay(2000);

      // 6. Welcome
      setStep('welcome');
      await delay(2000);

      // 7. Unlock (Pulse)
      setStep('unlock');
      await delay(2000);

      // 8. Final Window
      setStep('final');
      if (onReachFinalStep) onReachFinalStep();
    };

    sequence();
  }, [hasStarted, onReachFinalStep]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono overflow-hidden select-none"
      exit={{ 
        opacity: 0, 
        scale: 1.2, 
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: "easeInOut" } 
      }}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f3ff]/5 to-transparent scanline pointer-events-none"></div>

      <AnimatePresence mode="wait">

        {/* CLICK TO START */}
        {!hasStarted && (
            <motion.div
                key="start"
                exit={{ opacity: 0, scale: 1.5 }}
                className="z-50 cursor-pointer flex flex-col items-center"
                onClick={() => {
                    initAudio();
                    setHasStarted(true);
                }}
            >
                <div className="w-20 h-20 border border-[#00f3ff] rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_20px_#00f3ff]">
                    <div className="w-16 h-16 bg-[#00f3ff]/20 rounded-full animate-ping"></div>
                </div>
                <h1 className="text-[#00f3ff] font-bold tracking-[0.3em] text-sm md:text-xl animate-pulse">
                    INICIAR SISTEMA
                </h1>
                <p className="text-gray-500 text-[10px] mt-2 tracking-widest uppercase">
                    Toque para conectar
                </p>
            </motion.div>
        )}
        
        {/* LOADING */}
        {step === 'loading' && hasStarted && (
          <motion.div 
            key="loading"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            className="w-full max-w-xs relative"
          >
            <div className="font-mono text-[10px] text-gray-500 mb-4 h-20 overflow-hidden flex flex-col justify-end">
              {bootLines.map((line, i) => (
                <div key={i} className="border-l-2 border-[#00f3ff] pl-2 mb-1 animate-pulse">{line}</div>
              ))}
            </div>
            
            <div className="text-[#00f3ff] text-xs mb-1 flex justify-between font-bold tracking-widest">
              <span>CARREGANDO SISTEMA</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-900 w-full overflow-hidden border border-gray-800 relative">
              <div 
                className="h-full bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]" 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            </div>
          </motion.div>
        )}

        {/* ALERT */}
        {step === 'alert' && (
          <motion.div
            key="alert"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-red-500 text-2xl font-bold tracking-widest border-y border-red-500 py-2 bg-red-500/10">
              [ ALERTA DO SISTEMA ]
            </h1>
          </motion.div>
        )}

        {/* STATS (Terminal) */}
        {step === 'stats' && (
          <motion.div
            key="stats"
            className="text-left max-w-md w-full px-8"
          >
            <pre className="text-[#00f3ff] text-sm md:text-lg font-mono whitespace-pre-wrap leading-loose drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
              {typedText}<span className="animate-blink">_</span>
            </pre>
          </motion.div>
        )}

        {/* CONDITION (Strong Glitch) */}
        {step === 'condition' && (
          <motion.div
            key="condition"
            className="text-center relative"
          >
            <h1 className="text-4xl md:text-6xl font-black text-red-600 glitch-text tracking-tighter" data-text="CONDIÇÃO ATENDIDA">
              CONDIÇÃO ATENDIDA
            </h1>
          </motion.div>
        )}

        {/* CHANCE & WELCOME */}
        {(step === 'chance' || step === 'welcome') && (
          <motion.div
            key="chance"
            className="text-center relative z-10"
          >
             {step === 'chance' ? (
                 <motion.h1 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                 >
                    SEGUNDA CHANCE<br/>CONCEDIDA.
                 </motion.h1>
             ) : (
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white glitch-text-blue mb-4" data-text="Bem-vindo, Jogador.">
                        Bem-vindo, Jogador.
                    </h1>
                </motion.div>
             )}
          </motion.div>
        )}

        {/* UNLOCK */}
        {step === 'unlock' && (
           <motion.div
              key="unlock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center"
           >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                className="w-full h-px bg-[#00f3ff] shadow-[0_0_50px_#00f3ff] mb-8"
              ></motion.div>
              <h2 className="text-[#00f3ff] text-xl md:text-2xl tracking-[0.5em] uppercase font-bold animate-pulse">
                O DESPERTAR FOI LIBERADO
              </h2>
           </motion.div>
        )}

        {/* FINAL WINDOW & BUTTON */}
        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-md px-6"
          >
             <div className="bg-[#050508]/95 border border-[#00f3ff] p-1 rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)] overflow-hidden relative">
                {/* Holographic lines */}
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,transparent_50%,rgba(0,243,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                
                <div className="border border-[#00f3ff]/30 p-8 text-center relative z-10">
                    <div className="absolute top-0 left-0 bg-[#00f3ff] px-2 py-0.5 text-[10px] font-bold text-black">SYSTEM_MSG_001</div>
                    
                    <div className="mb-8 mt-4">
                        <Zap className="w-12 h-12 text-[#00f3ff] mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-300 text-sm font-mono leading-relaxed">
                            O sistema aguarda seu comando.<br/>
                            Sua evolução começa agora.
                        </p>
                    </div>

                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            boxShadow: ["0 0 0px #00f3ff", "0 0 20px #00f3ff", "0 0 0px #00f3ff"]
                        }}
                        transition={{ 
                            boxShadow: { duration: 2, repeat: Infinity },
                            duration: 0.5
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 243, 255, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { playClick(); onComplete(); }}
                        className="w-full py-4 border border-[#00f3ff] text-[#00f3ff] font-bold tracking-[0.2em] uppercase text-sm md:text-base relative overflow-hidden group"
                    >
                        <span className="relative z-10">ACESSAR O SISTEMA</span>
                        <div className="absolute inset-0 bg-[#00f3ff]/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </motion.button>
                </div>
             </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* CSS FX */}
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline {
          animation: scanline 8s linear infinite;
        }
        
        /* Red Glitch */
        .glitch-text {
          position: relative;
          animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        .glitch-text::before, .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
        }
        .glitch-text::before {
          left: 2px; text-shadow: -2px 0 #ff0000; clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px; text-shadow: -2px 0 #8b0000; clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 2s infinite linear alternate-reverse;
        }

        /* Blue Glitch */
        .glitch-text-blue {
          position: relative;
          color: #e0f7fa;
          text-shadow: 0 0 10px #00f3ff;
        }
        .glitch-text-blue::before, .glitch-text-blue::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
        }
        .glitch-text-blue::before {
          left: 2px; text-shadow: -2px 0 #00f3ff; clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }
        .glitch-text-blue::after {
          left: -2px; text-shadow: -2px 0 #0051ff; clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim2 2s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip: rect(10px, 9999px, 30px, 0); }
          20% { clip: rect(60px, 9999px, 10px, 0); }
          40% { clip: rect(20px, 9999px, 50px, 0); }
          60% { clip: rect(80px, 9999px, 20px, 0); }
          80% { clip: rect(40px, 9999px, 60px, 0); }
          100% { clip: rect(70px, 9999px, 90px, 0); }
        }
        @keyframes glitch-anim2 {
          0% { clip: rect(30px, 9999px, 10px, 0); }
          20% { clip: rect(10px, 9999px, 50px, 0); }
          40% { clip: rect(60px, 9999px, 20px, 0); }
          60% { clip: rect(90px, 9999px, 80px, 0); }
          80% { clip: rect(20px, 9999px, 40px, 0); }
          100% { clip: rect(50px, 9999px, 10px, 0); }
        }
      `}</style>
    </motion.div>
  );
}