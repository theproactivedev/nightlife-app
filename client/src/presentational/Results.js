import React, { Component } from 'react';

class Results extends Component {

  didUserReserveThis(businessId) {
    var reservations = this.props.userReservations;
    for(let i = 0; i < reservations; i++) {
      if(businessId === reservations[i].id) {
        return "Going";
      }
    }

    return "Not Going";
  }

  render() {
    let that = this;
    let going = "Not Going";

    var results = this.props.businesses.map(function(business, index) {

      if(that.props.isUserAuthenticated &&
        that.props.userReservations.length > 0) {
        going = that.didUserReserveThis(business.id).bind(this);
      }

      return (
        <div key={index} className="row businessItem">
          <div className="col-sm-12 col-md-5 col-lg-4">
            <img width="200px" height="200px" alt="Business Item" src={business.image_url} className="img-responsive center-block" />
          </div>

          <div className="col-sm-12 col-md-7 col-lg-8">
            <a href={business.url} target="_blank"><h3>{business.name}</h3></a>
            {that.props.isUserLoggedIn &&
              <button className="btn btn-success" onClick={() => {that.props.addUser(business)}}>{going}</button>
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
      {results}
      </div>

    );
  }
}

export default Results;
