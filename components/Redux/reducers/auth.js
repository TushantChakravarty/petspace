import { LOGIN_SUCCESS, LOGOUT, SETTOKEN} from "../actions/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

const user = AsyncStorage.getItem("user");
const token = AsyncStorage.getItem("token")
const initialState = user
  ? { isLoggedIn: true, user,token:token}
  : { isLoggedIn: false, user: null ,token:null};
export default auth = (state = initialState, action) => {
  const { type, payload } = action;
switch (type) {
  case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
  case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        walletsData:null,
        token:null,
      };
 
   case SETTOKEN:
                        return {
                         ...state,
                         isLoggedIn:true,
                         token:payload.token
                        }
                 
    default:
      return state;
  }
};