import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

interface ContactProps {
  contact: {
    email: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
}

const Contact = ({ contact }: ContactProps) => {
  // Fallback for contact if null
  const safeContact = contact || {};
  return (
    <section className="contact-section" id="contact">
      <h2>GET IN TOUCH</h2>
      <div className="contact-links">
        <a
          href={safeContact.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(safeContact.email)}` : '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaEnvelope size={24} />
        </a>
        <a
          href={safeContact.linkedin || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href={safeContact.github || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={24} />
        </a>
        <a
          href={safeContact.instagram || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
      </div>
    </section>
  );
};

export default Contact;