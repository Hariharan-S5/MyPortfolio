import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import React from 'react';
interface Achievement {
  title: string;
  description: string;
  prize?: string;
  timestamp?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
    // Pagination logic for 2 rows x 2 columns
    const pageSize = 4;
    const [currentPage, setCurrentPage] = React.useState(0);
    const sortedAchievements = [...achievements].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const totalPages = Math.ceil(sortedAchievements.length / pageSize);
    const pagedAchievements = sortedAchievements.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
    const rows = [];
    for (let i = 0; i < pagedAchievements.length; i += 2) {
      rows.push(pagedAchievements.slice(i, i + 2));
    }
  return (
    <section className="achievements-section" id="achievements">
      <h2>Achievements <span className="section-count-chip">{"("+achievements.length+")"}</span></h2>
      <div className="achievements-carousel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {currentPage > 0 && (
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={() => setCurrentPage(currentPage - 1)}
              aria-label="Previous achievements"
              style={{ marginRight: '2rem' }}
            >
              <FaChevronLeft size={24} />
            </button>
          )}
          <div className="achievements-grid">
            {rows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {row.map((achievement, colIdx) => (
                  <div key={colIdx} className="achievement-item">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                    {achievement.prize && <p className="achievement-prize">{achievement.prize}</p>}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          {currentPage < totalPages - 1 && (
            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={() => setCurrentPage(currentPage + 1)}
              aria-label="Next achievements"
              style={{ marginLeft: '2rem' }}
            >
              <FaChevronRight size={24} />
            </button>
          )}
        </div>
        {/* Bottom indicator dots for achievements navigation */}
        {totalPages > 1 && (
          <div className="achievement-indicators" style={{ marginTop: '1.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`achievement-dot${i === currentPage ? ' active' : ''}`}
                onClick={() => setCurrentPage(i)}
                aria-label={`Go to page ${i + 1}`}
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
      </div>
    </section>
  );
};

export default Achievements;