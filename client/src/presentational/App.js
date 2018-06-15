import React from 'react';
import Navigation from '../containers/Navigation';
import Content from '../containers/Content';
import Footer from './Footer';

const App = () => {
	return(
		<div>
			<Navigation />
			<Content />
			<Footer />
		</div>
	);
}

export default App;
