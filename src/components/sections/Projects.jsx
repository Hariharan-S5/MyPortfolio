import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import metadata from '../../data/metadata.json';

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-rose-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-blue-500'
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
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
              {metadata.sections?.projects?.title || "Completed Projects"}
            </h2>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 shadow-sm mt-1">
              {metadata.projects?.length || 0}
            </span>
          </div>
        </div>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {metadata.sections?.projects?.subtitle || "Showcasing my latest work and technical expertise."}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...metadata.projects].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
          >
            {/* Project Image */}
            <div className={`w-full h-48 bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden shrink-0`}>
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              )}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm bg-black/20"
              >
                <div className="flex gap-4">
                  {project.codeLink && (
                    <a 
                      href={project.isCodeClickable ? project.codeLink : '#'} 
                      target={project.isCodeClickable ? "_blank" : undefined}
                      rel="noreferrer" 
                      onClick={(e) => !project.isCodeClickable && e.preventDefault()}
                      className={`p-3 bg-white text-black rounded-full transition-all ${!project.isCodeClickable ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-110 transition-transform'}`}
                      title={!project.isCodeClickable ? "Code repository not available" : "View Code"}
                    >
                      <Globe size={20} />
                    </a>
                  )}
                  {project.liveLink && (
                    <a 
                      href={project.isClickable ? project.liveLink : '#'} 
                      target={project.isClickable ? "_blank" : undefined}
                      rel="noreferrer" 
                      onClick={(e) => !project.isClickable && e.preventDefault()}
                      className={`p-3 bg-white text-black rounded-full transition-all ${!project.isClickable ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-110 transition-transform'}`}
                      title={!project.isClickable ? "Live preview not available" : "View Live"}
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-primary mb-3 font-medium">{project.category}</p>
              <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-1">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
