import React, { useState } from 'react';
import { 
  FaPython, 
  FaAngular, 
  FaNodeJs, 
  FaGitAlt, 
  FaWindows, 
  FaCode, 
  FaRobot,
  FaExchangeAlt,
  FaKey,
  FaTerminal,
  FaCuttlefish,
  FaUbuntu,
  FaCentos,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { SiTypescript, SiExpress, SiPostgresql, SiSqlite, SiRedis, SiLangchain, SiOpenai } from 'react-icons/si';


interface SkillsProps {
  skills: string[];
}

const Skills = ({ skills }: SkillsProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  // Skills per page: 3 rows × 5 columns = 15 skills
  const skillsPerPage = 15;
  const totalPages = Math.ceil(skills.length / skillsPerPage);
  
  // Get current page skills
  const startIndex = currentPage * skillsPerPage;
  const endIndex = startIndex + skillsPerPage;
  const currentSkills = skills.slice(startIndex, endIndex);
  
  // Navigation functions with fade effect
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFading(false);
      }, 150);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFading(false);
      }, 150);
    }
  };

  // Map skills to icons
  const getSkillIcon = (skill: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Python': <FaPython size={24} />,
      'Angular 15': <FaAngular size={24} />,
      'TypeScript': <SiTypescript size={24} />,
      'Node.js': <FaNodeJs size={24} />,
      'Express.js': <SiExpress size={24} />,
      'PostgreSQL': <SiPostgresql size={24} />,
      'SQLite': <SiSqlite size={24} />,
      'Redis': <SiRedis size={24} />,
      'Langchain': <SiLangchain size={24} />,
      'LLM Integration (GPT, Claude, Gemini)': <SiOpenai size={24} />,
      'Agent Frameworks (AutoGen)': <FaRobot size={24} />,
      'API Integration': <FaExchangeAlt size={24} />,
      'Message Orchestration': <FaRobot size={24} />,
      'Reactive Programming with RxJS': <FaCode size={24} />,
      'JWT Authentication': <FaKey size={24} />,
      'Shell Scripting': <FaTerminal size={24} />,
      'C Programming': <FaCuttlefish size={24} />,
      'Git': <FaGitAlt size={24} />,
      'Ubuntu OS': <FaUbuntu size={24} />,
      'CentOS OS': <FaCentos size={24} />,
      'Windows OS': <FaWindows size={24} />,
      'VS Code': <FaCode size={24} />
    };
    return iconMap[skill] || <FaCode size={24} />;
  };

  return (
    <section className="skills-section" id="skills">
      <h2>Technical Skills <span className="section-count-chip">{"("+skills.length+")"}</span></h2>
      <div className="skills-carousel">
        {currentPage > 0 && (
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={prevPage}
            aria-label="Previous skills"
          >
            <FaChevronLeft size={24} />
          </button>
        )}
        
        <div className="skills-container">
          <div className={`skills-grid ${isFading ? 'fade' : ''}`}>
            {currentSkills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-icon">{getSkillIcon(skill)}</div>
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        </div>
        
        {currentPage < totalPages - 1 && (
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={nextPage}
            aria-label="Next skills"
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="technical-indicators" style={{ marginTop: '1.5rem' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`technical-dot${i === currentPage ? ' active' : ''}`}
              onClick={() => setCurrentPage(i)}
              aria-label={`Go to skills page ${i + 1}`}
            >
              <span>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height={i === currentPage ? 14 : 8}
                  width={i === currentPage ? 14 : 8}
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: i === currentPage ? 'var(--primary-color)' : 'var(--secondary-color)' }}
                >
                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;