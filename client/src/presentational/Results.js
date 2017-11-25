import React, { Component } from 'react';

class Results extends Component {

  constructor(props) {
    super(props);
    this.didUserReserveThis = this.didUserReserveThis.bind(this);
  }

  didUserReserveThis(businessId) {
    let reservations = this.props.userReservations;
    if (reservations !== undefined) {
      for(let i = 0; i < reservations.length; i++) {
        if (reservations[i].businessId === businessId) {
          return "Going";
        }
      }
    }

    return "Going here?";
  }

  render() {
    let businesses = this.props.businesses;
    let results = [];
    for (let i = 0; i < businesses.length; i++) {
      let going = "";

      if (this.props.userReservations !== undefined) {
        going = this.didUserReserveThis(businesses[i].id);
      }

      let item = (
        <div className="row">
          <div className="col-sm-12 col-md-5 col-lg-4">
            <img width="200px" height="200px" alt="Business Item" src={businesses[i].image_url} className="img-responsive center-block" />
          </div>

          <div className="col-sm-12 col-md-7 col-lg-8">
            <a className="businessName" href={businesses[i].url} target="_blank"><h3>{businesses[i].name}</h3></a>
            {this.props.isUserLoggedIn &&
              <button className={`btn btn-success ${businesses[i].name}`} onClick={() => {this.props.toggleChoice(businesses[i])}}>{going}</button>
            }
            <p><strong>Phone: </strong>{businesses[i].phone}</p>
            <p>{businesses[i].location.display_address[0]}</p>
            <p>{businesses[i].location.display_address[1]}</p>
            <p>{businesses[i].location.display_address[2]}</p>
          </div>
        </div>
      );
      results.push(item);
    }

    return (
      <div className="results">
      <ul>
      {results.map((result, index) => {
        return (
          <li key={index} className="businessItem">{result}</li>
        );
      })}
      </ul>
      </div>
    );
  }
}

export default Results;
