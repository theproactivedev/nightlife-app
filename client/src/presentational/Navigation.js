import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth';

class Navigation extends Component {

  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      user: "",
      identification: "?",
      token: ''
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
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
        var person = JSON.parse(localStorage['ytrap']);
        this.setState({
          isAuthenticated: true,
          user: person.name,
          identification: person.identity,
          token: person.token
        });
        this.props.onUserLogin(true, person.name, person.identity, person.token);
      }
    });
  }

  onFailed(error) {
    alert(error);
  }

  logout() {
    this.setState({
      isAuthenticated: false,
      token: '',
      user: "",
      identification: ""
    });
    localStorage.removeItem('ytrap');
    this.props.onUserLogout();
  }

  componentWillMount() {
    if (localStorage['ytrap'] !== undefined) {
      var person = JSON.parse(localStorage['ytrap']);
      this.setState({
        isAuthenticated : true,
        user: person.name,
        identification: person.identity,
        token: person.token
      });
    }
  }

  render() {

    const navbarInstance = (
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
          <NavItem>
            <Navbar.Brand>FCC Nightlife App</Navbar.Brand>
          </NavItem>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav pullRight>
          {!this.state.isAuthenticated &&
            <NavItem eventKey={1}>
              <TwitterLogin className="twitter-btn" showIcon={false} loginUrl="http://localhost:3000/api/v1/auth/twitter"
              onFailure={this.onFailed} onSuccess={this.onSuccess}
              requestTokenUrl="http://localhost:3000/api/v1/auth/twitter/reverse" />
            </NavItem>
          }

          {!!this.state.isAuthenticated &&
            <NavItem eventKey={1} onClick={this.logout}>{this.state.user} Log Out</NavItem>
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

export default Navigation;
