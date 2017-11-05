import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import App from './presentational/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<App />,
  document.getElementById('root')
);
registerServiceWorker();
