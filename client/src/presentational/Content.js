
import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';

class Content extends Component {
  constructor() {
    super();
    this.state = {
      place: "",
      results: [],
      userReservations: []
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.getUserReservations = this.getUserReservations.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handlePostContent = this.handlePostContent.bind(this);
    this.saveSearchedPlace = this.saveSearchedPlace.bind(this);
    this.toggleChoice = this.toggleChoice.bind(this);
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

  handleSearchChange(e) {
    if (e.target.value === "") {
      this.setState({
        results: [],
        place: ""
      });
    } else {
      this.setState({
        place: e.target.value,
      });
    }
  }

  handlePostContent(url, obj) {

    fetch(url, {
      method: "POST",
      headers: new Headers({
        'Content-type' : 'application/json',
        'x-auth-token' : this.props.userToken
      }),
      body: JSON.stringify(obj)
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  }

  getSearchResults() {
    var that = this;
    var link = "/search/" + this.state.place;
    fetch(link)
    .then(this.handleResponse)
    .then(function(businesses) {
      that.setState({
        results: businesses
      });
    })
    .catch(this.handleError);
  }

  getUserReservations(token) {
    var that = this;
    var request = new Request('/userReservations', {
      method: "GET",
      headers: new Headers({
        'Content' : 'application/json',
        'x-auth-token' : token
      })
    });
    fetch(request)
    .then(this.handleResponse)
    .then(function(data) {
      that.setState({
        place: data.searchedPlace,
        userReservations: data.reservations
      }, that.getSearchResults);
    })
    .catch(this.handleError);
  }

  saveSearchedPlace() {
    var content = {
      place: this.state.place
    };
    this.handlePostContent("/savingSearchedPlace", content);
  }

  submitForm(e) {
		e.preventDefault();
    this.getSearchResults();
    if (this.props.isUserAuthenticated) {
      this.saveSearchedPlace();
    }
  }

  removeUser(id) {
    var content = {
      identification: id
    };
    this.handlePostContent("/removingUserReservation", content);
  }

  addUser(id) {
    var content = {
      businessId: id
    };
    this.handlePostContent("/addingUserReservation", content);
  }

  toggleChoice(item) {
    var btnTxt = document.getElementsByClassName(item.name)[0].innerHTML;
    if (btnTxt === "Going here?") {
      this.addUser(item.id);
      document.getElementsByClassName(item.name)[0].innerHTML = "Going";
    } else {
      this.removeUser(item.id);
      document.getElementsByClassName(item.name)[0].innerHTML = "Going here?";
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userToken !== "") {
      this.getUserReservations(nextProps.userToken);
    }
  }

  componentWillMount() {
    if (this.props.isUserAuthenticated) {
      this.getUserReservations(this.props.userToken);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <span className="icons"><i className="fa fa-map-marker" aria-hidden="true"></i><i className="fa fa-users" aria-hidden="true"></i><i className="fa fa-cutlery" aria-hidden="true"></i></span>
          <h1 id="home">Hungry? Want to pig out?</h1>
        </div>

        <SearchBar onSubmit={this.submitForm} onChange={this.handleSearchChange}
        place={this.state.place} />

				{this.state.results.length > 0 &&
					<Results isUserLoggedIn={this.props.isUserAuthenticated} businesses={this.state.results} userReservations={this.state.userReservations} toggleChoice={this.toggleChoice} />
				}
      </div>
    );
  }
}


export default Content;
