import { useState } from 'react';
import { FaExternalLinkAlt, FaCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Project {
  title: string;
  description: string;
  tech: string[];
  liveLink: string;
  codeLink: string;
  image: string;
  category: string;
  timestamp: number;
  isClickable: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
    // Project grid navigation
    const [projectGridStartIdx, setProjectGridStartIdx] = useState(0);
    const handleProjectLeftArrow = () => {
      setProjectGridStartIdx((prev: number) => (prev > 0 ? prev - 2 : 0));
    };
    const handleProjectRightArrow = () => {
      if (selectedCategory && groupedProjects[selectedCategory]) {
        setProjectGridStartIdx((prev: number) =>
          prev + 2 < groupedProjects[selectedCategory].length ? prev + 2 : prev
        );
      }
    };
  // Sort projects by timestamp (latest first)
  const sortedProjects = [...projects].sort((a, b) => b.timestamp - a.timestamp);

  // Group sorted projects by category
  const groupedProjects = sortedProjects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const categories = Object.keys(groupedProjects);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
  const [categoryStartIdx, setCategoryStartIdx] = useState(0);

  // Arrow handlers
  const handleLeftArrow = () => {
    setCategoryStartIdx((prev) => (prev > 0 ? prev - 1 : 0));
  };
  const handleRightArrow = () => {
    setCategoryStartIdx((prev) =>
      prev < categories.length - 3 ? prev + 1 : prev
    );
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setProjectGridStartIdx(0);
  };

  // Show maximum chips per row
  const maxChipsPerRow = 5; // Adjust this value for your layout
  const visibleCategories = categories.slice(categoryStartIdx, categoryStartIdx + maxChipsPerRow);

  return (
    <section className="projects-section" id="projects">
      <h2>Projects <span className="section-count-chip">{"("+projects.length+")"}</span></h2>
      <div className="project-category-chips-wrapper">
        <button
          className="carousel-arrow"
          onClick={handleLeftArrow}
          disabled={categoryStartIdx === 0}
          style={categoryStartIdx === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <FaChevronLeft />
        </button>
        <div className="project-category-chips-row">
          {visibleCategories.map((category) => (
            <div
              key={category}
              className={`project-chip${selectedCategory === category ? ' selected' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
              <span className="project-chip-count">{groupedProjects[category].length}</span>
            </div>
          ))}
        </div>
        <button
          className="carousel-arrow"
          onClick={handleRightArrow}
          disabled={categoryStartIdx >= categories.length - maxChipsPerRow}
          style={categoryStartIdx >= categories.length - maxChipsPerRow ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <FaChevronRight />
        </button>
      </div>
      {/* Show projects for selected category */}
      {selectedCategory && groupedProjects[selectedCategory] && (
        <div className="category-section">
          <div className="projects-grid-nav">
            <button
              className="carousel-arrow"
              onClick={handleProjectLeftArrow}
              disabled={projectGridStartIdx === 0}
              style={projectGridStartIdx === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <FaChevronLeft />
            </button>
            <div className="projects-grid">
              {groupedProjects[selectedCategory]
                .slice(projectGridStartIdx, projectGridStartIdx + 2)
                .map((project, index) => (
                  <div key={index} className="project-card">
                    <div className="project-content">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <div className="tech-stack">
                        {project.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">
                            {/* Optionally add icons for known techs */}
                            
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="project-links">
                        {project.isClickable ? (
                          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="live-link">
                            <FaExternalLinkAlt />
                          </a>
                        ) : (
                          <span className="live-link disabled">
                            <FaExternalLinkAlt />
                          </span>
                        )}
                        {project.isClickable ? (
                          <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="code-link">
                            <FaCode />
                          </a>
                        ) : (
                          <span className="code-link disabled">
                            <FaCode />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button
              className="carousel-arrow"
              onClick={handleProjectRightArrow}
              disabled={projectGridStartIdx + 2 >= groupedProjects[selectedCategory].length}
              style={projectGridStartIdx + 2 >= groupedProjects[selectedCategory].length ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              <FaChevronRight />
            </button>
          </div>
        {/* Bottom indicator dots for project navigation */}
        {selectedCategory && groupedProjects[selectedCategory] && groupedProjects[selectedCategory].length > 0 && (
          <div className="achievement-indicators" style={{ marginTop: '1.5rem' }}>
            {Array.from({ length: Math.ceil(groupedProjects[selectedCategory].length / 2) }).map((_, idx) => (
              <button
                key={idx}
                className={`achievement-dot${idx === Math.floor(projectGridStartIdx / 2) ? ' active' : ''}`}
                onClick={() => setProjectGridStartIdx(idx * 2)}
                aria-label={`Go to page ${idx + 1}`}
              >
                <span>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height={idx === Math.floor(projectGridStartIdx / 2) ? 14 : 8}
                    width={idx === Math.floor(projectGridStartIdx / 2) ? 14 : 8}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: idx === Math.floor(projectGridStartIdx / 2) ? 'var(--primary-color)' : 'var(--secondary-color)' }}
                  >
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      )}
    </section>
  );
};

export default Projects;