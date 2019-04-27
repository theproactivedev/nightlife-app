import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { restoApp, initialState } from './reducers';
import App from './presentational/App';
import registerServiceWorker from './registerServiceWorker';

let store = createStore(
  restoApp,
  initialState,
  applyMiddleware(thunkMiddleware)
);

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
