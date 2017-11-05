import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';

class Content extends Component {
  constructor() {
    super();
    this.state = {
      term: "",
      redirect: false,
      hasSubmittedForm: false,
      userCity: "",
      userLocation: "",
      results: [],
      userReservations: []
    }

    this.submitForm = this.submitForm.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.addUser = this.addUser.bind(this);
    this.getUserReservations = this.getUserReservations.bind(this);
  }

  handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject({
        status: res.status,
        statusTxt: res.statusText,
        link: res.url
      });
    }
  }

  handleError(err) {
    console.log("Status on Content: " + err.status + " " + err.statusTxt);
    console.log("Link on Content: " + err.link);
  }

  getUserLocation() {
    var that = this;

    fetch('http://ipinfo.io/json')
    .then(this.handleResponse)
    .then(function(item) {
      that.setState({
        userCity: item.city,
        userLocation: item.loc
      });
    })
    .catch(this.handleError);
  }

  getUserReservations() {
    var that = this;
    let content = {
      userId: this.props.userId
    };

    fetch('/userReservations',
    {
      headers: {
        'authorization': this.props.userId,
        'Cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify(content)
    })
    .then(this.handleResponse)
    .then(function(reservations) {
      that.setState({
        userReservations: reservations
      });
      console.log("User reservations: " + reservations.length);

    })
    .catch(this.handleError);
  }

  submitForm(e) {
		e.preventDefault();
    var content = {
      term: this.state.term,
      city: this.state.userCity,
      loc: this.state.userLocation
    };
		var that = this;

    // get user details here and add it to state
    if (this.props.isUserAuthenticated) {
      this.getUserReservations();
    }

    fetch("/search",
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(content)
		})
		.then(this.handleResponse)
		.then(function(businesses) {
			that.setState({
				results: businesses
			});
		})
		.catch(this.handleError);

  }

  addUser(businessItem) {
    var that = this;
    var addr = businessItem.location.display_address.slice(0);
    let bAddress = "";
    for(let i = 0; i < addr.length; i++) {
      bAddress += addr[i];
    }

    var content = {
      userId: this.props.userId,
      businessId: businessItem.id,
      name: businessItem.name,
      url: businessItem.url,
      address: bAddress
    }

    fetch("/addingUserReservation",
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: "POST",
			body: JSON.stringify(content)
		})
		.then(this.handleResponse)
		.then(function(businesses) {
			that.setState({
				results: businesses
			});
		})
		.catch(this.handleError);

  }

  handleSearchChange(e) {
    this.setState({
      term: e.target.value
    });
    if (e.target.value === "") {
      this.setState({
        results: []
      });
    }
  }

  componentWillMount() {
    this.getUserLocation();
  }

  render() {
    return (
      <div className="container">
        <SearchBar onSubmit={this.submitForm} onChange={this.handleSearchChange} />

				{this.state.results.length > 0 &&
					<Results isUserLoggedIn={this.props.isUserAuthenticated} businesses={this.state.results} addUser={this.addUser} userReservations={this.state.userReservations} />
				}
      </div>
    );
  }
}


export default Content;
