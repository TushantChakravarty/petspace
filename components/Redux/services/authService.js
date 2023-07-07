import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../../screens/constants/constants";

const logIn = async (user) => {
  console.log("user info", user)
  let response
  const { username, password } = user;
  try{

  
        response =await fetch(`${url}/user/login`,{
          method: 'POST',
          headers: {
                   Accept: 'application/json',
                   'Content-Type': 'application/json'
          },
         body: JSON.stringify({
          emailId: username,
          password: password
                   })
         }).then((response) => response.json())
         .then(async (responseJson) => {
          //console.log(responseJson)
          if(responseJson){
            if (responseJson.responseCode===404) {
              return {
                status: "invalid",
                message: "please provide valid credentials ",
                user: null
              };
            }if (responseJson.responseCode===405) {
              return {
                status: "invalid",
                message: "please provide valid credentials ",
                user: null
              };
            }
              if(responseJson.responseCode===200)
             AsyncStorage.setItem("user", JSON.stringify(username));
              
      
      return {
        status: "success",
        message: "You are redirecting to home page",
        user:username,
        isEmailVerified:responseJson.responseData.isEmailVerified,
        token:responseJson.responseData.token
        
      };
    }
   else{
    if (responseJson.responseCode===400) {
      return {
        status: "Not Found",
        message: "user not found ",
        emailId: null
      };
    }
    if (responseJson.responseCode===404) {
      return {
        status: "invalid",
        message: "please provide valid credentials ",
        emailId: null
      };
    }
   }
    
  
  }).catch((error)=>{
    alert(error)
  })
}catch(e){
  console.log(e)
  alert(e)
}
  console.log(response)
  return response

  
};

const setToken = async(token) =>{
if(token)
{
  AsyncStorage.setItem("token", token);
      return {
        status: "success",
        message: "token saved",
        token: token,
      };
}
}

  
const logOut = async () => {

  return {
    status: "success",
    message: "You are logged out",
  };
};


export default {
  logIn,

  logOut,

  setToken,

};