import React, { Component } from 'react';

class Results extends Component {

  // didUserReserveThis(businessId) {
  //   let reservations = this.props.reservations;
  //   for(let i = 0; i < reservations.length; i++) {
  //     if (reservations[i].businessId === businessId) {
  //       console.log("R: " + reservations[i].businessId);
  //       console.log("Search: " + businessId);
  //       return "Going";
  //     }
  //   }
  //
  //   return "Not Going";
  // }
  //
  // if(that.props.userReservations) {
  //   going = that.didUserReserveThis.bind(that, business.id);
  //   console.log(index + ": " + going);
  // }

  render() {
    var that = this;
    var results = this.props.businesses.map(function(business, index) {
      return (
        <div className="row">
          <div className="col-sm-12 col-md-5 col-lg-4">
            <img width="200px" height="200px" alt="Business Item" src={business.image_url} className="img-responsive center-block" />
          </div>

          <div className="col-sm-12 col-md-7 col-lg-8">
            <a href={business.url} target="_blank"><h3>{business.name}</h3></a>
            {that.props.isUserLoggedIn &&
              <button className={`btn btn-success ${business.name}`} onClick={() => {that.props.toggleChoice(business)}}>Going here?</button>
            }
            <p><strong>Phone: </strong>{business.phone}</p>
            <p>{business.location.display_address[0]}</p>
            <p>{business.location.display_address[1]}</p>
            <p>{business.location.display_address[2]}</p>
          </div>
        </div>
      )
    });

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
