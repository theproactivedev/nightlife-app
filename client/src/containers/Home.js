import React, { Component } from 'react';
import SearchBar from './SearchBar';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getUserReservations } from '../actions';
import Fade from 'react-reveal/Fade';

class Home extends Component {
  componentDidMount() {
    const { isUserAuthenticated, user : { userToken, userName } } = this.props;
    if (isUserAuthenticated && userName !== "" ) {
      this.props.getUserReservations(userToken);
    }
  }

  render() {
    return (
      <div className="homepage">
        <Container>
          <Fade top><h1 id="home">Search restaurants near you</h1></Fade>
          <p>The meals you're craving, expect that it's taken care of.</p>

          <SearchBar fromHome={true} />
        </Container>
    </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, isUserAuthenticated } = state;
  return { user, isUserAuthenticated };
}

const mapDispatchToProps = dispatch => {
  return {
    getUserReservations
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
