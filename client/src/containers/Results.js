import React, { Component } from 'react';
import { connect } from 'react-redux';
import Restaurants from '../presentational/Restaurants';
import { ClipLoader } from 'react-spinners';
import { changeUserChoices } from '../actions.js';
import SearchBar from './SearchBar';
import Fade from 'react-reveal/Fade';

class Results extends Component {

  constructor(props) {
    super(props);

    this.toggleChoice = this.toggleChoice.bind(this);
  }

  toggleChoice(item) {
    var btnTxt = document.getElementsByClassName(item.name)[0].innerHTML;
    if (btnTxt === "RSVP") {
      this.props.dispatch(
        changeUserChoices('/addingUserReservation',
          { businessId: item.id },
          this.props.user.userToken
        )
      );
      document.getElementsByClassName(item.name)[0].innerHTML = "RSVP'ed";
    } else {
      this.props.dispatch(
        changeUserChoices('/removingUserReservation',
          { identification: item.id },
          this.props.user.userToken
        )
      );
      document.getElementsByClassName(item.name)[0].innerHTML = "RSVP";
    }
  }

  render() {
    return (
      <div>
        <header className="results-head">
          <div className="container py-4 py-lg-5">
            <Fade top>
              <h1>Results (10)</h1>
            </Fade>
            <SearchBar fromHome={false} />
          </div>   
        </header>   
        <main className="py-2 py-lg-4">
          <div className="spinner">
            <ClipLoader
              color={'#3c3c3d'}
              loading={this.props.isFetching}
            />
          </div>
          {!this.props.isFetching &&
            <Restaurants isUserLoggedIn={this.props.isUserAuthenticated} userName={this.props.user.userName} businesses={this.props.searchedResults} userReservations={this.props.reservedResults} toggleChoice={this.toggleChoice} />
          }
        </main>
      </div>
    )
  }
}

const mapStateToProps = state => {
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

export default connect(mapStateToProps)(Results);