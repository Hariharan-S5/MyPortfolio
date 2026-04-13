import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Search, Briefcase, User } from 'lucide-react';
import metadata from '../../data/metadata.json';
import { getAssetUrl } from '../../utils/assetUrl';

export default function About() {
  const [skillSearch, setSkillSearch] = useState('');
  const filteredSkills = (metadata.skills || []).filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <section id="about" className="py-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      {/* About Me: Photo + Text */}
      {metadata.sections?.about?.show !== false && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16">
          {/* Left: Photo or Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-blue-400 to-purple-500 blur-xl opacity-40 scale-110 animate-pulse" />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-[3px] bg-gradient-to-br from-primary via-blue-400 to-purple-500 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                  {metadata.profileImage ? (
                    <img
                      src={getAssetUrl(metadata.profileImage)}
                      alt={metadata.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <User size={80} className="text-primary/50" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: About Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {metadata.sections?.about?.title || "About Me"}
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-6 mx-auto md:mx-0"></div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              {metadata.about}
            </p>
          </motion.div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Journey & Education */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-10"
        >
          {/* Experience */}
          {metadata.sections?.experience?.show !== false && metadata.experience && metadata.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Briefcase className="text-primary" size={28} />
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-semibold">
                    {metadata.sections?.experience?.title || "Work Experience"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
                    {metadata.experience.length}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {[...metadata.experience].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-border pb-2 last:pb-0">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2 shadow-[0_0_8px_rgba(var(--primary),0.6)]"></div>
                    <h4 className="text-lg font-bold text-foreground">{item.role}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-primary text-sm font-medium mb-2">
                      <span>{item.company}</span>
                      <span className="hidden sm:inline text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{item.duration}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {metadata.sections?.achievements?.show !== false && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Award className="text-primary" size={28} />
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-semibold">
                    {metadata.sections?.achievements?.title || "Achievements"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
                    {metadata.achievements?.length || 0}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {[...(metadata.achievements || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-border pb-2 last:pb-0">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2 shadow-[0_0_8px_rgba(var(--primary),0.6)]"></div>
                    <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
                    <p className="text-primary text-sm font-medium mb-2">{item.prize}</p>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


        </motion.div>

        {/* Skills & Education */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-10"
        >
          {/* Skills */}
          {metadata.sections?.skills?.show !== false && (
            <div className="glass-card p-8 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[60px] -z-10" />
              
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-semibold">
                    {metadata.sections?.skills?.title || "Technical Arsenal"}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
                    {metadata.skills?.length || 0}
                  </span>
                </div>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={e => setSkillSearch(e.target.value)}
                    className="pl-8 pr-4 py-1.5 text-sm rounded-lg bg-background/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors w-44"
                  />
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                {metadata.sections?.skills?.subtitle || "I've worked with a wide variety of programming languages, frameworks, and tools. Here is my technology stack:"}
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {filteredSkills.length > 0 ? filteredSkills.map((skill, index) => (
                  <motion.span 
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-background/80 border border-border text-foreground hover:border-primary hover:text-primary transition-colors cursor-default shadow-sm"
                  >
                    {skill}
                  </motion.span>
                )) : (
                  <p className="text-muted-foreground text-sm italic">No skills found for "{skillSearch}"</p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {metadata.sections?.education?.show !== false && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <GraduationCap className="text-primary" size={28} />
                <h3 className="text-2xl font-semibold">
                  {metadata.sections?.education?.title || "Education"}
                </h3>
              </div>
              <div className="space-y-6">
                {[...(metadata.education || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((item, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-xl border border-border/50">
                    <h4 className="text-lg font-bold">{item.degree}</h4>
                    <p className="text-muted-foreground">{item.school}</p>
                    <div className="flex justify-between items-center mt-3 text-sm font-medium text-primary">
                      <span>{item.year}</span>
                      <span>{item.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
