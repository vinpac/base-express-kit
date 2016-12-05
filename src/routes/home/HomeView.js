import React from 'react'
import Link from 'react-router/Link'
import Toolbar from '../../components/elements/Toolbar'
import Footer from '../../components/elements/Footer'


class HomeView extends React.Component {

  componentDidMount() {
    document.title = 'Home'
  }

  render() {
    return (
      <div className="view-home">
        <Toolbar />
        <div className="view-spacer container text-xs-center">
          <h1>Home View</h1>
          <Link to="/about" className="text-accent text-weight-semibold">
            Go to About <i className="fa fa-arrow-right sp-xs-left-1" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
}

export default HomeView
