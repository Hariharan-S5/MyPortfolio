import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';

interface CertificateContent {
  topic: string;
  description: string;
}

interface Certificate {
  name: string;
  provider: string;
  date: string;
  timestamp: number;
  website: string;
  image: string;
  content: CertificateContent[];
  certificateLink?: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates = ({ certificates }: CertificatesProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const certificatesPerPage = 3;
  const totalPages = Math.ceil(certificates.length / certificatesPerPage);
  const sortedCertificates = [...certificates].sort((a, b) => b.timestamp - a.timestamp);
  const startIndex = currentPage * certificatesPerPage;
  const endIndex = startIndex + certificatesPerPage;
  const currentCertificates = sortedCertificates.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPage((prev: number) => prev + 1);
        setIsFading(false);
      }, 150);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentPage((prev: number) => prev - 1);
        setIsFading(false);
      }, 150);
    }
  };

  const openCertificateInTab = (certificate: Certificate) => {
    sessionStorage.setItem('selectedCertificate', JSON.stringify(certificate));
    window.open('/certificate-viewer.html', 'certificate_viewer', 'width=1200,height=800');
  };

  return (
    <section className="certificates-section" id="certificates">
      <h2>Certificates <span className="section-count-chip">{"("+certificates.length+")"}</span></h2>
      <div className="skills-carousel">
        {currentPage > 0 && (
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={prevPage}
            aria-label="Previous certificates"
          >
            <FaChevronLeft size={24} />
          </button>
        )}
        <div className="certificates-container">
          <div className={`certificates-grid ${isFading ? 'fade' : ''}`} style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
            {currentCertificates.map((certificate, index) => (
              <div key={index} className="certificate-item">
                <div className="certificate-info">
                  <h3 className="certificate-name">{certificate.name}</h3>
                  <p className="certificate-date">{certificate.date}</p>
                  <p className="certificate-provider">Provider: <a href={certificate.website} target="_blank" rel="noopener noreferrer">{certificate.provider}</a></p>
                </div>
                <button
                  onClick={() => openCertificateInTab(certificate)}
                  className="certificate-icon-button"
                  title="View Certificate"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        {currentPage < totalPages - 1 && (
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={nextPage}
            aria-label="Next certificates"
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>
      {totalPages > 1 && (
        <div className="certificate-indicators">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`certificate-dot${i === currentPage ? ' active' : ''}`}
              onClick={() => setCurrentPage(i)}
              aria-label={`Go to page ${i + 1}`}
            >
              <span><FaCircle size={i === currentPage ? 14 : 8} color={i === currentPage ? 'var(--primary-color)' : 'var(--secondary-color)'} /></span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Certificates;