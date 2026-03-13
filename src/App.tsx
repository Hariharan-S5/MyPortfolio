import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Contact from './components/Contact';
import metadata from './data/metadata.json';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero
        name={metadata.name}
        title={metadata.title}
        contact={metadata.contact}
        resume={metadata.resume}
      />
      <About about={metadata.about} location={metadata.location} profileImage={metadata.profileImage} name={metadata.name} />
      <Skills skills={metadata.skills} />
      <Certificates certificates={metadata.certificates} />
      <Achievements achievements={metadata.achievements} />
      <Projects projects={metadata.projects} />
      <Education education={metadata.education} />
      <Contact contact={metadata.contact} />
      <footer>
        <p>© 2026 {metadata.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
