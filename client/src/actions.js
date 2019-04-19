export const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
export const FETCH_RESULTS_RECEIVED = 'FETCH_RESULTS_RECEIVED';
export const FETCH_RESULTS_REJECTED = 'FETCH_RESULTS_REJECTED';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const REMOVE_USER = 'REMOVE_USER';
export const SAVE_SEARCHED_PLACE = 'SAVE_SEARCHED_PLACE';
export const SET_USER_RESERVATIONS = 'SET_USER_RESERVATIONS';
export const CLEAR_STATE = 'CLEAR_STATE';

export function setUserDetails(user) {
  return {
    type: SET_USER_DETAILS,
    user
  };
}

export function removeUser() {
  return {
    type: REMOVE_USER
  };
}

function requestResults() {
  return {
    type: FETCH_RESULTS_PENDING
  };
}

function receiveResults(results) {
  return {
    type: FETCH_RESULTS_RECEIVED,
    results
  };
}

function rejectResults(error) {
  return {
    type: FETCH_RESULTS_REJECTED,
    error
  };
}

function setUserReservations(data) {
  return {
    type: SET_USER_RESERVATIONS,
    searchedPlace: data.searchedPlace,
    reservedResults: data.reservations
  };
}

export function saveSearchedPlace(place) {
  return {
    type: SAVE_SEARCHED_PLACE,
    place
  };
}

export function clearState() {
  return {
    type: CLEAR_STATE
  };
}

export function fetchResultsFromYelp(place) {
  return dispatch => {
    dispatch(saveSearchedPlace(place));
    dispatch(requestResults());
    return fetch("/search/" + place, {
      method: "GET",
      headers: new Headers({
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
      })
    })
    .then(response => response.json(),
      error => dispatch(rejectResults(error)))
    .then(json => dispatch(receiveResults(json)));
  };
}

export function postWithToken(dest, obj, token) {
  return (dispatch) => {
    return fetch(dest, {
        method: "POST",
        headers: new Headers({
          'Content-type' : 'application/json',
          'x-auth-token' : token
        }),
        body: JSON.stringify(obj)
      })
      .then(response => response.json(),
      error => dispatch(rejectResults(error)));
  };
}

export function getUserReservations (token) {
  return (dispatch, getState) => {
    return fetch('/userReservations', {
      method: "GET",
      headers: new Headers({
        'Accept' : 'application/json',
        'Content-type' : 'application/json',
        'x-auth-token' : token
      })
    })
    .then(response => response.json(),
    error => dispatch(rejectResults(error)))
    .then(json => dispatch(setUserReservations(json)))
    .then(json => dispatch(fetchResultsFromYelp('/search/' + getState().searchedPlace)));
  };
}

