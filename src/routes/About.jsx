import React from "react";

const About = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", textAlign: "center", lineHeight: "1.6" }}>
      <h1>About This Web App</h1>
      <p>
        This web application is built using <strong>Vite</strong> and <strong>React.js</strong>, leveraging the 
        <a href="https://akabab.github.io/superhero-api/" target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
        Superhero API
        </a> to provide detailed information about various superheroes and villains.
      </p>
      <h2>Features</h2>
      <ul style={{ textAlign: "left", margin: "20px auto", padding: "0 20px" }}>
        <li>Search and filter superheroes based on their alignment, publisher, and other attributes.</li>
        <li>View detailed information about each character, including their power stats, biography, and affiliations.</li>
        <li>Interactive charts to visualize character power stats and alignments.</li>
      </ul>
      <h2>How It Works</h2>
      <p>
        The app fetches data from the Superhero API, which provides a comprehensive dataset of superheroes and villains, including their power stats, biography, and images. 
        The data is dynamically rendered using React components, and the app is styled for a clean and responsive user experience.
      </p>
      <h2>Technologies Used</h2>
      <ul style={{ textAlign: "left", margin: "20px auto", padding: "0 20px" }}>
        <li><strong>Vite:</strong> A fast build tool and development server for modern web applications.</li>
        <li><strong>React.js:</strong> A JavaScript library for building user interfaces.</li>
        <li><strong>Recharts:</strong> A charting library used to create interactive visualizations.</li>
        <li><strong>React Router:</strong> For handling navigation and routing within the app.</li>
        <li><strong>Superhero API:</strong> The source of all superhero and villain data.</li>
      </ul>
      <p>
        This project demonstrates how to integrate a third-party API into a modern web application using React.js and Vite, while providing an engaging and interactive user experience.
      </p>
    </div>
  );
};

export default About;