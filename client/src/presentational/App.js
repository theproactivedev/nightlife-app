import React from 'react';
import Navigation from '../containers/Navigation';
import Content from '../containers/Content';
import Footer from './Footer';
import '../styles/main.css';
import Fade from 'react-reveal/Fade';

const App = () => {
	return(
		<div>
			<Fade top><Navigation /></Fade>
			<Content />
			<Footer />
		</div>
	);
}

export default App;
