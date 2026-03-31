import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import metadata from '../../data/metadata.json';
import { getAssetUrl } from '../../utils/assetUrl';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full text-center flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex flex-row items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/30 text-primary text-sm font-medium mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {metadata.location} Based Developer
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {metadata.sections?.hero?.greeting || "Hi, I'm"} <br className="hidden md:block" />
          <span className="text-gradient">{metadata.name}</span>
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-semibold text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {metadata.title}
        </motion.h2>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl px-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {metadata.subtitle}
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#projects" className="group flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40">
            View My Work
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={getAssetUrl(metadata.resume)} target="_blank" rel="noreferrer" download className="group flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/20 dark:hover:bg-black/20 font-medium transition-all">
            <Download size={18} />
            Download CV
          </a>
        </motion.div>

        <motion.div 
          className="flex items-center gap-6 mt-16 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {metadata.contact.github && (
            <a href={metadata.contact.github} target="_blank" rel="noreferrer" className="hover:text-foreground hover:scale-110 transition-all">
              <FaGithub size={24} />
            </a>
          )}
          {metadata.contact.linkedin && (
            <a href={metadata.contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0A66C2] hover:scale-110 transition-all">
              <FaLinkedin size={24} />
            </a>
          )}

          {metadata.contact.instagram && (
            <a href={metadata.contact.instagram} target="_blank" rel="noreferrer" className="hover:text-[#E4405F] hover:scale-110 transition-all">
              <FaInstagram size={24} />
            </a>
          )}
          {metadata.contact.leetcode && (
            <a href={metadata.contact.leetcode} target="_blank" rel="noreferrer" className="hover:text-[#FFA116] hover:scale-110 transition-all">
              <SiLeetcode size={24} />
            </a>
          )}
        </motion.div>

      </div>
    </section>
  );
}

