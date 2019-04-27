import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import { LinkContainer } from 'react-router-bootstrap';
import { removeUser, setUserDetails } from '../actions.js';
import { connect } from 'react-redux';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
  }

  getUserDetails() {
    var person = JSON.parse(localStorage['ytrap']);
    var userDetails = {
      userName: person.name,
      userId: person.identity,
      userToken: person.token
    };
    this.props.dispatch(setUserDetails(userDetails));
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        localStorage.setItem("ytrap",
          JSON.stringify(
            {
              "identity" : user.twitterProvider.identification,
              "name" : user.twitterProvider.name,
              "token" : token
            }
          )
        );
        this.getUserDetails();
      }
    });
  }

  onFailed(error) {
    alert(error);
  }

  logout() {
    this.props.dispatch(removeUser());
    localStorage.removeItem('ytrap');
  }

  componentWillMount() {
    if (localStorage['ytrap'] !== undefined) {
      this.getUserDetails();
    }
  }

  render() {

    const navbarInstance = (
      <Navbar className="py-1" bg="pink" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Where to <span className="np-icon np-pig"></span> Out</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end w-100" as="ul">
              {!this.props.isUserAuthenticated &&
                  <Nav.Item key={1}>
                    <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="https://eg-fcc-resto.herokuapp.com/api/v1/auth/twitter"
                    onFailure={this.onFailed} onSuccess={this.onSuccess}
                    requestTokenUrl="https://eg-fcc-resto.herokuapp.com/api/v1/auth/twitter/reverse" />
                  </Nav.Item>
                }

                {!!this.props.isUserAuthenticated  &&
                  <Nav.Item key={1} onClick={this.logout}>{this.props.user.userName} Log Out</Nav.Item>
                }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
		);

		return(
      <div>
        {navbarInstance}
      </div>
		);
  }
}

function mapStateToProps(state) {
  const { isUserAuthenticated, user } = state;
  return {
    isUserAuthenticated,
    user
  };
}

export default connect(mapStateToProps)(Navigation);
