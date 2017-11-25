import React, { Component } from 'react';
import SearchBar from '../presentational/SearchBar';
import Results from '../presentational/Results';
import {
  fetchResultsFromYelp,
  postWithToken,
  getUserReservations,
  saveSearchedPlace,
  clearState
} from '../actions.js';
import { connect } from 'react-redux';

class Content extends Component {

  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.toggleChoice = this.toggleChoice.bind(this);
  }

  handleSearchChange(e) {
    if (e.target.value === "") {
      this.props.dispatch(clearState());
    } else {
      // save searched place in the state
      console.log(e.target.value);
      this.props.dispatch(saveSearchedPlace(e.target.value));
    }
  }

  getSearchResults() {
    var link = "/search/" + this.props.searchedPlace;
    this.props.dispatch(fetchResultsFromYelp(link));
    console.log("Link: " + link);
  }

  submitForm(e) {
		e.preventDefault();
    this.getSearchResults();
    if (this.props.isUserAuthenticated) {
      // save searched place in the database
      this.props.dispatch(
        postWithToken('/savingSearchedPlace',
          { place: this.props.searchedPlace },
          this.props.user.userToken
        )
      );
    }
  }

  toggleChoice(item) {
    var btnTxt = document.getElementsByClassName(item.name)[0].innerHTML;
    if (btnTxt === "Going here?") {
      this.props.dispatch(
        postWithToken('/addingUserReservation',
          { businessId: item.id },
          this.props.user.userToken
        )
      );
      document.getElementsByClassName(item.name)[0].innerHTML = "Going";
    } else {
      this.props.dispatch(
        postWithToken('/removingUserReservation',
          { identification: item.id },
          this.props.user.userToken
        )
      );
      document.getElementsByClassName(item.name)[0].innerHTML = "Going here?";
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUserAuthenticated && !this.props.isUserAuthenticated) {
      this.props.dispatch(getUserReservations(nextProps.user.userToken));
    }
  }

  componentWillMount() {
    if (this.props.isUserAuthenticated) {
      this.props.dispatch(getUserReservations(this.props.user.userToken));
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
        place={this.props.searchedPlace} />

        {this.props.isFetching &&
          <p>Loading...</p>
        }

				{!this.props.isFetching &&
					<Results isUserLoggedIn={this.props.isUserAuthenticated} businesses={this.props.searchedResults} userReservations={this.props.reservedResults} toggleChoice={this.toggleChoice} />
				}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    searchedPlace,
    user,
    isUserAuthenticated,
    reservedResults,
    searchedResults,
    isFetching
  } = state;
  return {
    searchedPlace,
    user,
    isUserAuthenticated,
    reservedResults,
    searchedResults,
    isFetching
  };
}

export default connect(mapStateToProps)(Content);
