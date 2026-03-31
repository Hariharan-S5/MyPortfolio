import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, BookOpen, X, Eye } from 'lucide-react';
import metadata from '../../data/metadata.json';
import { getAssetUrl } from '../../utils/assetUrl';

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section id="certificates" className="py-24 relative">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {metadata.sections?.certificates?.title || "Official Certifications"}
            </h2>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 shadow-sm mt-1">
              {metadata.certificates?.length || 0}
            </span>
          </div>
        </div>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          {metadata.sections?.certificates?.subtitle || "My professional journey through continuous learning and specialized certifications."}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        {[...metadata.certificates].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group glass-card rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Award size={24} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/50 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  {cert.date}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                {cert.name}
              </h3>

              <a 
                href={cert.website || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline mb-4"
              >
                {cert.provider}
                <ExternalLink size={14} />
              </a>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                {cert.description || "Course focusing on advanced technical implementations and professional certification."}
              </p>
            </div>

            <button 
              onClick={() => setSelectedCert(cert)}
              className="w-full py-4 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
            >
              <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
              View Certificate
            </button>
          </motion.div>
        ))}
      </div>

      {/* Full-Screen Overlay / Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          >
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-zoom-out"
            />

            {/* Modal Content container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] bg-card border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-6 right-6 z-[110] p-3 rounded-full bg-background/80 hover:bg-red-500 text-foreground hover:text-white backdrop-blur-xl transition-all shadow-2xl border border-border/50 hover:border-red-600 active:scale-90 flex items-center justify-center group/close"
                title="Close Overlay"
              >
                <X size={24} className="group-hover/close:rotate-90 transition-transform duration-300" />
              </button>

              <div className="flex-1 overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left Side: Certificate Image (Fixed) */}
                  <div className="w-full md:w-1/2 bg-secondary/20 p-8 flex items-center justify-center min-h-[300px] md:h-full border-b md:border-b-0 md:border-r border-border/30 overflow-hidden">
                    {selectedCert.image ? (
                      <img 
                        src={getAssetUrl(selectedCert.image)} 
                        alt={selectedCert.name} 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-border/50"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-muted-foreground/30 py-12">
                        <Award size={100} strokeWidth={1} />
                        <span className="font-medium text-lg italic">Preview not available</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Header (Fixed) + Curriculum (Scrollable) */}
                  <div className="w-full md:w-1/2 h-full flex flex-col bg-card">
                    {/* Fixed Header within Right Side */}
                    <div className="p-8 md:p-10 lg:p-12 pb-6 border-b border-border/30 shrink-0">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-1 leading-tight text-gradient">Curriculum & Skills Gained</h4>
                          <p className="text-primary font-semibold flex items-center gap-2 italic">
                            {selectedCert.provider} • {selectedCert.date}
                          </p>
                        </div>
                        {selectedCert.website && (
                          <a 
                            href={selectedCert.website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-fit px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-2"
                          >
                            Verify Credential
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Scrollable Curriculum List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 lg:p-12 pt-6">
                      <div className="grid gap-5 pb-10">
                        {selectedCert.content && selectedCert.content.length > 0 ? (
                          selectedCert.content.map((item, cIndex) => (
                            <motion.div 
                              key={cIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: cIndex * 0.1 }}
                              className="p-5 rounded-2xl bg-secondary/10 border border-border/30 hover:bg-secondary/20 transition-colors"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                  <BookOpen size={18} />
                                </div>
                                <div className="space-y-1">
                                  <h5 className="font-bold text-base text-foreground leading-snug">{item.topic}</h5>
                                  <p className="text-muted-foreground leading-relaxed text-xs italic">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground italic text-center py-8">
                            Detailed curriculum information for this certification is pending update.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
