import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Zap, Eye, Flame, Box, ArrowRight, Star, Activity, User, Heart, MessageCircle, Target, Dumbbell, Brain } from 'lucide-react';

export default function ArchitectDemo() {
  const [step, setStep] = useState(0); // 0: Idle, 1: User Typing, 2: User Sent, 3: Analyzing, 4: System Response
  const [userText, setUserText] = useState("");
  const fullUserText = "Arquiteto, quero acordar cedo, treinar 4x por semana, organizar meu quarto, beber 2L de água por dia e preciso entregar meu trabalho até sexta.";
  
  const containerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [step, userText]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const sequence = async () => {
        // Step 1: Type User Message
        setStep(1);
        for (let i = 0; i <= fullUserText.length; i++) {
            setUserText(fullUserText.slice(0, i));
            await new Promise(r => setTimeout(r, 30)); 
        }
        setStep(2);
        
        // Step 2: Analyzing
        await new Promise(r => setTimeout(r, 800));
        setStep(3);

        // Step 3: System Response
        await new Promise(r => setTimeout(r, 2000));
        setStep(4);
    };

    if (step === 0) sequence();
  }, [isInView]);

  return (
    <div ref={containerRef} className="bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm max-w-2xl mx-auto flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
        <div className="font-mono text-xs text-gray-500 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            Evolução IA - Como Funciona
        </div>
      </div>

      {/* Chat Body */}
      <div ref={chatBodyRef} className="p-6 space-y-6 overflow-y-auto flex-1 font-mono text-sm relative scroll-smooth">
        
        {/* User Message */}
        <div className="flex justify-end min-h-[80px]">
            {(step >= 1) && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="msg-user p-4 max-w-[90%] text-gray-300 bg-white/5 border border-white/10 rounded-tl-xl rounded-tr-none rounded-bl-xl rounded-br-xl shadow-sm"
                >
                    {userText}
                    {step === 1 && <span className="animate-blink">|</span>}
                </motion.div>
            )}
        </div>

        {/* Analyzing Indicator */}
        <AnimatePresence>
            {step === 3 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 text-[#00f3ff] text-xs py-2"
                >
                    <div className="flex gap-1">
                        <motion.span animate={{ scaleY: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-0.5 h-3 bg-[#00f3ff]"/>
                        <motion.span animate={{ scaleY: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-0.5 h-3 bg-[#00f3ff]"/>
                        <motion.span animate={{ scaleY: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-0.5 h-3 bg-[#00f3ff]"/>
                    </div>
                    ANALISANDO INTENÇÃO...
                </motion.div>
            )}
        </AnimatePresence>

        {/* System Response */}
        {step >= 4 && (
            <motion.div className="flex justify-start pb-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="msg-system p-5 max-w-[95%] text-white bg-[#00f3ff]/5 border border-[#00f3ff]/30 rounded-tl-none rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                >
                    <div className="mb-4 text-[#00f3ff] font-bold text-xs tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" /> SISTEMA ATUALIZADO:
                    </div>
                    
                    <p className="mb-4 text-gray-300">Entendido. Estruturei seu caminho para a semana.</p>
                    
                    <div className="space-y-2 bg-black/40 p-3 rounded mb-4 text-xs border border-white/5">
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                            className="flex justify-between border-b border-white/5 pb-2 items-center"
                        >
                            <span className="flex items-center gap-2"><span className="text-red-400">⚔️</span> Missão: Treino de Força</span>
                            <span className="text-[#00f3ff] font-bold bg-[#00f3ff]/10 px-2 py-0.5 rounded">+150 XP</span>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}
                            className="flex justify-between border-b border-white/5 pb-2 pt-1 items-center"
                        >
                            <span className="flex items-center gap-2"><span className="text-blue-400">💧</span> Quest: Hidratação</span>
                            <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded">+10 Vitalidade</span>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
                            className="flex justify-between pt-1 items-center"
                        >
                            <span className="flex items-center gap-2"><span className="text-yellow-400">📦</span> Quest: Organização</span>
                            <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded">+50 Ordem</span>
                        </motion.div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                        className="italic text-gray-400 border-l-2 border-[#00f3ff] pl-3 text-xs leading-relaxed"
                    >
                        "Percebi padrões de exaustão à noite. Ajustei sua rotina de sono para garantir a entrega do trabalho na sexta."
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
      </div>

      {/* Input Fake */}
      <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3 shrink-0">
        <div className="flex-1 bg-black/50 h-10 rounded border border-white/10 flex items-center px-3 text-xs text-gray-600 font-mono">
            {step === 0 ? "Digite seu objetivo..." : ""}
        </div>
        <div className={`w-10 h-10 rounded border flex items-center justify-center transition-colors ${step >= 2 ? 'bg-[#00f3ff]/20 border-[#00f3ff]/50' : 'bg-white/5 border-white/10'}`}>
            <ArrowRight className={`w-4 h-4 ${step >= 2 ? 'text-[#00f3ff]' : 'text-gray-600'}`} />
        </div>
      </div>
    </div>
  );
}