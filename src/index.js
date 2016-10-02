import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import Router from 'react-router/BrowserRouter'
import configureStore from './redux/configureStore'

import App from './App'
import './styles/app.scss'

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router pathname="/">
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
