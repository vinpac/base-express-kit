import React from 'react'
import Match from 'react-router/Match'
import routes from './routes'

class App extends React.Component {
  render() {
    return (
      <div className="app">
        {routes.map((route, i) => {
          return (
            <Match
              key={i}
              pattern={route.pattern}
              component={route.action}
              exactly={route.exactly}
            />
          )
        })}
      </div>
    );
  }
}

export default App;
