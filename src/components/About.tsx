interface AboutProps {
  about: string;
  location: string;
  profileImage: string;
  name: string;
}

const About = ({ about, location, profileImage, name }: AboutProps) => {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <img src={profileImage} alt={name} className="profile-image" />
        <div className="about-text">
          <h2>About Me</h2>
          <p>{about}</p>
          <div className="location">
            <span>📍</span>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;