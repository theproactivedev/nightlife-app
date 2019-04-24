import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Results from './Results';
import Home from './Home';

const Content = () => {
	return(
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/search/:place" render={(props) => (
			  <Results {...props} />
			)} />
		</Switch>
	);
};

export default Content;