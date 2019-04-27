export const FETCH_RESULTS_PENDING = 'FETCH_RESULTS_PENDING';
export const FETCH_RESULTS_RECEIVED = 'FETCH_RESULTS_RECEIVED';
export const FETCH_RESULTS_REJECTED = 'FETCH_RESULTS_REJECTED';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const REMOVE_USER = 'REMOVE_USER';
export const SAVE_SEARCHED_PLACE = 'SAVE_SEARCHED_PLACE';
export const SET_USER_RESERVATIONS = 'SET_USER_RESERVATIONS';
export const CLEAR_STATE = 'CLEAR_STATE';

export const setUserDetails = (user) => {
  return {
    type: SET_USER_DETAILS,
    user
  };
}

export const removeUser = () => {
  return {
    type: REMOVE_USER
  };
}

const requestResults = () => {
  return {
    type: FETCH_RESULTS_PENDING
  };
}

const receiveResults = (results) => {
  return {
    type: FETCH_RESULTS_RECEIVED,
    results
  };
}

const rejectResults = (error) => {
  return {
    type: FETCH_RESULTS_REJECTED,
    error
  };
}

const setUserReservations = (data) => {
  return {
    type: SET_USER_RESERVATIONS,
    searchedPlace: data.searchedPlace,
    reservedResults: data.reservations
  };
}

export const saveSearchedPlace = (place) => {
  return {
    type: SAVE_SEARCHED_PLACE,
    place
  };
}

export const clearState = () => {
  return {
    type: CLEAR_STATE
  };
}

export const fetchResultsFromYelp = (place) => {
  return dispatch => {
    dispatch(saveSearchedPlace(place));
    dispatch(requestResults());
    return fetch("/search/" + place, {
      method: "GET",
      headers: new Headers({
        'Accept' : 'application/json'
      })
    })
    .then(response => response.json(),
      error => dispatch(rejectResults(error)))
    .then(json => dispatch(receiveResults(json)));
  };
}

export const changeUserChoices = (dest, obj, token) => {
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

export const getUserReservations = (token) => {
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
    .then(json => dispatch(setUserReservations(json)));
  };
}

