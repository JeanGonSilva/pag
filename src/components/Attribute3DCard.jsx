import React from 'react';
import { motion } from 'framer-motion';

export default function Attribute3DCard({ icon: Icon, label, color = "#00f3ff", delay = 0 }) {
  return (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group perspective-1000 cursor-default relative"
          >
            {/* Immersive Floating +1 effect */}
            <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                whileInView={{ 
                    opacity: [0, 1, 0], 
                    y: -40,
                    scale: 1
                }}
                transition={{ 
                    duration: 2, 
                    delay: delay + 0.5,
                    repeat: Infinity,
                    repeatDelay: 3
                }}
                className="absolute -top-4 right-2 text-[#00f3ff] font-bold font-hud z-20 pointer-events-none"
            >
                +{Math.floor(Math.random() * 3) + 1}
            </motion.div>

            <motion.div
        animate={{ 
          rotateX: [0, 5, 0, -5, 0], 
          rotateY: [0, 5, 0, -5, 0],
          y: [0, -8, 0]
        }}
        whileHover={{ 
          rotateX: 10, 
          rotateY: 10, 
          scale: 1.05,
          z: 50,
          y: -5
        }}
        transition={{ 
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          delay: Math.random() * 2 // Randomize start for organic feel
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Inner Glow on Hover */}
        <div className="absolute inset-0 bg-[#00f3ff]/0 group-hover:bg-[#00f3ff]/10 transition-colors duration-500" />
        
        {/* Top Highlight (Glass Reflection) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Icon Container */}
        <div 
          className="mb-3 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]"
          style={{ color: color, transform: "translateZ(20px)" }}
        >
          <Icon size={48} strokeWidth={1.5} />
        </div>
        
        {/* Label */}
        <span 
          className="font-hud text-base font-bold text-white tracking-wider drop-shadow-md group-hover:text-[#00f3ff] transition-colors"
          style={{ transform: "translateZ(10px)" }}
        >
          {label}
        </span>
        
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#00f3ff]/50 transition-colors duration-500 box-border" />
      </motion.div>
    </motion.div>
  );
}