import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  fetchResultsFromYelp,
  postWithToken
} from '../actions.js';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: this.props.searchedPlace,
      redirect: false
    };

    this.submitForm = this.submitForm.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.redirectToResults = this.redirectToResults.bind(this); 
  }

  handleSearchChange(e) {
    this.setState({ input: e.target.value });
  }

  redirectToResults() {
    if (this.props.fromHome) {
      this.setState({ redirect : true });
    } else {
      this.props.history.push("/search/" + this.state.input);
    }
  }

  async submitForm(e) {
    e.preventDefault();  
    this.props.dispatch(fetchResultsFromYelp(this.state.input));
    if (this.props.isUserAuthenticated) {
      // save searched place in the database
      this.props.dispatch(
        postWithToken('/savingSearchedPlace',
          { place: this.state.input },
          this.props.user.userToken
        )
      );
    }
    this.redirectToResults(); 
  }

  componentDidMount() {
    const { fromHome, isUserAuthenticated, searchedPlace } = this.props;
    if (fromHome) {
      if (isUserAuthenticated) {
        this.setState({
          input: searchedPlace
        });
      } else {
        this.setState({
          input: ""
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchedPlace !== this.props.searchedPlace && this.props.isUserAuthenticated
      && this.props.fromHome) {
      this.setState({
        input: this.props.searchedPlace
      });
    }
  }

  render() {
    if (this.state.redirect && this.props.fromHome) {
      return <Redirect to={{ pathname: `/search/${this.state.input}` }} />;
    }

    return(
      <div className="row">
        <div className="col-sm-12 col-md-9 col-lg-8">
          <form method="POST" onSubmit={(e) => this.submitForm(e)}>
            <div className="row">
              <div className="col-12 col-md-7 col-lg-8 mb-2 mb-md-0">
                <input type="text" id="searchBar" name="searchBar" className="form-control" onChange={(e) => this.handleSearchChange(e)} placeholder="Where are you?" value={this.state.input || ""} required />
              </div>
              <div className="col-12 col-md-5 col-lg-4">
                <input type="submit" value="Go" id="submitBtn" className="btn btn-pink form-control w-100" />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  const {
    searchedPlace,
    user,
    isUserAuthenticated,
    isFetching
  } = state;
  return {
    searchedPlace,
    user,
    isUserAuthenticated,
    isFetching
  };
}

SearchBar.propTypes = {
  searchedPlace: PropTypes.string, 
  user: PropTypes.object,
  isUserAuthenticated: PropTypes.bool,
  isFetching: PropTypes.bool
}

export default withRouter(connect(mapStateToProps)(SearchBar));

