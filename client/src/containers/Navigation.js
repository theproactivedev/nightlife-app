import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';
import {
  removeUser,
  setUserDetails
} from '../actions.js';
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
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
          <NavItem>
            <Navbar.Brand>FCC Resto <i className="fa fa-map-marker" aria-hidden="true"></i></Navbar.Brand>
          </NavItem>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
          {!this.props.isUserAuthenticated &&
            <NavItem eventKey={1}>
              <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="https://morning-lake-82922.herokuapp.com/api/v1/auth/twitter"
              onFailure={this.onFailed} onSuccess={this.onSuccess}
              requestTokenUrl="https://morning-lake-82922.herokuapp.com/api/v1/auth/twitter/reverse" />
            </NavItem>
          }

          {!!this.props.isUserAuthenticated  &&
            <NavItem eventKey={1} onClick={this.logout}>{this.props.user.userName} Log Out</NavItem>
          }
					</Nav>
				</Navbar.Collapse>
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
