interface EducationProps {
  education: Array<{
    school: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
}

const Education = ({ education }: EducationProps) => {
  // Group education items into rows of 2
  const rows = [];
  for (let i = 0; i < education.length; i += 2) {
    rows.push(education.slice(i, i + 2));
  }
  return (
    <section className="education-section" id="education">
      <h2>Education <span className="section-count-chip"></span></h2>
      <div className="education-grid">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="education-row">
            {row.map((edu, colIdx) => (
              <div key={colIdx} className="education-card">
                <h3>{edu.school}</h3>
                <p className="education-degree">{edu.degree}</p>
                <p className="education-year">{edu.year}</p>
                {edu.gpa && <p className="education-gpa">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;