import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import metadata from '../../data/metadata.json';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {metadata.sections?.contact?.title || "Get in Touch"}
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
          {metadata.sections?.contact?.subtitle || "Have a project in mind or just want to say hi? Feel free to reach out."}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1"
          onClick={() => window.location.href = `mailto:${metadata.contact.email}`}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mb-2">
            <Mail size={32} />
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Email</h4>
            <p className="text-muted-foreground">{metadata.contact.email}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 transition-all hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mb-2">
            <MapPin size={32} />
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Location</h4>
            <p className="text-muted-foreground">{metadata.location}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1"
          onClick={() => window.open(metadata.contact.linkedin, '_blank')}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mb-2">
            <FaLinkedin size={32} />
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">LinkedIn</h4>
            <p className="text-muted-foreground">Connect with me</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
