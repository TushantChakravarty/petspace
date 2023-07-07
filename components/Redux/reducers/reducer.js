import { combineReducers } from 'redux'
const defaultState=0
const mainReducer = (state=defaultState, action) => {
  switch(action.type) {
    case "LOGIN":
      return Object.assign({}, state, {
        user: action.payload.user,
        loginSuccess: true,
    });
    case "LOGOUT":
      return Object.assign({}, state, {
        loginSuccess: false,
      });
     
    case "SETTOKEN":
      return Object.assign({}, state, {
        token:action.payload.token
    });
    
    default:
      return state;
  }
}

export default combineReducers({ main: mainReducer})