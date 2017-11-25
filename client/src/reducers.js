import {
  FETCH_RESULTS_PENDING,
  FETCH_RESULTS_RECEIVED,
  FETCH_RESULTS_REJECTED,
  SET_USER_DETAILS,
  REMOVE_USER,
  SAVE_SEARCHED_PLACE,
  SET_USER_RESERVATIONS,
  CLEAR_STATE
} from './actions.js';

export const initialState = {
  isFetching: false,
  isUserAuthenticated: false,
  user : {
    userName: "",
    userId: "",
    userToken: "",
  },
  searchedResults: [],
  reservedResults: [],
  searchedPlace: "",
  error: ""
};

export const restoApp = (state=initialState, action) => {
  switch(action.type) {
    case SET_USER_DETAILS :
      return {
        ...state,
        isUserAuthenticated: true,
        user: {
          userName: action.user.userName,
          userId: action.user.userId,
          userToken: action.user.userToken
        }
      };
    case REMOVE_USER :
      return {
        ...state,
        isUserAuthenticated: false,
        user: {
          userName: "",
          userId: "",
          userToken: ""
        },
        reservedResults: []
      };
    case FETCH_RESULTS_PENDING :
      return {
        ...state,
        isFetching: true
      };
    case FETCH_RESULTS_RECEIVED :
      return {
        ...state,
        isFetching: false,
        searchedResults: action.results
      };
    case FETCH_RESULTS_REJECTED :
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case SAVE_SEARCHED_PLACE :
      return {
        ...state,
        searchedPlace: action.place
      };
    case SET_USER_RESERVATIONS :
      return {
        ...state,
        isFetching: false,
        searchedPlace: action.searchedPlace,
        reservedResults: action.reservedResults
      };
    case CLEAR_STATE :
      return {
        ...state,
        isFetching: false,
        searchedPlace: "",
        searchedResults: []
      };
    default:
      return state;
  }
};
