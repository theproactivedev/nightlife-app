import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

class Restaurants extends Component {

  constructor(props) {
    super(props);
    this.didUserReserveThis = this.didUserReserveThis.bind(this);
    this.renderStars = this.renderStars.bind(this);
  }

  didUserReserveThis(businessId) {
    let reservations = this.props.userReservations;
    if (reservations !== undefined) {
      for(let i = 0; i < reservations.length; i++) {
        if (reservations[i].businessId === businessId) {
          return "RSVP'ed";
        }
      }
    }

    return "RSVP";
  }

  renderStars(rating) {
    let stars = [];
    for(let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="star-icon"></span>);
    }

    return stars;
  }

  render() {
    const { businesses, userName, isUserLoggedIn, userReservations, toggleChoice } = this.props;
    let results = [];
    for (let i = 0; i < businesses.length; i++) {
      let rsvpButton = "";
      let rsvpBtnClass = "";
      let stars = this.renderStars(Math.round(businesses[i].rating));

      if (userName !== "" && isUserLoggedIn) {
        if (userReservations !== undefined) {
          rsvpButton = this.didUserReserveThis(businesses[i].id);
        }
      } else {
        rsvpButton = "Log in to RSVP";
        rsvpBtnClass = "disabled";
      }

      let item = (
        <Card>
          <div style={{height: "190px", background: `#ddd url('${businesses[i].image_url}') no-repeat center`, backgroundSize: "cover"}}>
          <button className={`btn btn-pink ${businesses[i].name} ${rsvpBtnClass}`} onClick={() => {toggleChoice(businesses[i])}}>{rsvpButton}</button>
          
          </div>
          <Card.Body>
            <Card.Title>
              <a className="businessName" href={businesses[i].url}><h3>{businesses[i].name}</h3></a>
            </Card.Title>
            <Card.Text as="div">
              <p>{stars}</p>
              <p>{businesses[i].price}</p>
              <p><strong>Phone: </strong>{businesses[i].phone}</p>
              <p>{businesses[i].location.display_address[0]}</p>
              <p>{businesses[i].location.display_address[1]}</p>
              <p>{businesses[i].location.display_address[2]}</p>
            </Card.Text>
          </Card.Body>
        </Card>
      );
      results.push(item);
    }

    return (
      <div className="results">
        <div className="container">
          <ul>
          {results.map((result, index) => {
            return (
              <li key={index} className="business-item">{result}</li>
            );
          })}
          </ul>
        </div>
      </div>
    );
  }
}

Restaurants.propTypes = {
  didUserReserveThis: PropTypes.func,
  toggleChoice: PropTypes.func,
  userReservations: PropTypes.array,
  businesses: PropTypes.array,
  isUserLoggedIn: PropTypes.bool
};

export default Restaurants;
