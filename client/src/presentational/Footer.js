import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>
          <span>&copy; 2019 <a href="https://eiringonzalescodes.com/">Eirin Gonzales</a></span>
          <span className="float-right">
            <a href="https://github.com/theproactivedev/resto-app">GitHub Repo</a> |&nbsp;
            <a href="https://twitter.com/theproactivedev">Twitter</a> |&nbsp;
            <a href="https://www.linkedin.com/in/eirin-gonzales-5951aa9b">Linkedin</a> |&nbsp;
            <a href="https://theproactivedeveloper.wordpress.com/">Blog</a>
          </span>
        </p>
      </Container>
    </footer>
  );
}

export default Footer;