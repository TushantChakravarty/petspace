const { default: AsyncStorage } = require("@react-native-async-storage/async-storage");
const { url } = require("../constants/constants");

const getUserProfile = async (emailId) => {
  const token = await AsyncStorage.getItem('token')
  const response = await fetch(`${url}/user/getUserProfile`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailId: emailId,
      token:token
    }),
  })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (responseJson) {
        if(responseJson.responseCode===403)
        {
          //console.log(response)
          //alert('invalid Login. Please log in again')
          return responseJson
        }
        if (responseJson.responseCode === 200) {
          return responseJson.responseData[0];
        }
      }
    })
    .catch((e)=>{
      console.log(e)
    })
  return response;
};
async function forgotPassword(emailId,password)
{
    const response =await fetch(`${url}/user/forgotpassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId:emailId,
          password:password
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log(responseJson);
          if (responseJson) {
            if (responseJson.responseCode === 200) {
              console.log("Password matched");
              return responseJson
              // navigation.navigate('SignInScreen')
            }
            else
            {
                return responseJson
            }
          }
        });
        return response
  }

  async function setNewPassword(emailId,password)
  {
      const response =await fetch(`${url}/user/setnewpassword`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailId:emailId,
            password:password
          }),
        })
          .then((response) => response.json())
          .then(async (responseJson) => {
            console.log(responseJson);
            if (responseJson) {
              if (responseJson.responseCode === 200) {
                //alert("Profile Details Updated");
                return responseJson
                // navigation.navigate('SignInScreen')
              }
              else
              {
                  return responseJson
              }
            }
          });
          return response
    }

    async function sendOtp(emailId,newEmail)
    {
      const response =await fetch(`${url}/user/sendOtp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId:emailId,
          newEmail:newEmail
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log(responseJson);
          if (responseJson) {
            if (responseJson.responseCode === 200) {
              //alert("Profile Details Updated");
              console.log(responseJson)
              return responseJson
              // navigation.navigate('SignInScreen')
            }
            else
            {
                return responseJson
            }
          }
        });
        return response
  
    }
  
    async function confirmOtp(emailId,otp)
    {
      const response =await fetch(`${url}/user/confirmotp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId:emailId,
          otp:otp
        
        }),
      })
        .then((response) => response.json())
        .then(async (responseJson) => {
          console.log(responseJson);
          if (responseJson) {
            if (responseJson.responseCode === 200) {
              //alert("Profile Details Updated");
              console.log(responseJson)
              return responseJson
              // navigation.navigate('SignInScreen')
            }
            else
            {
                return responseJson
            }
          }
        });
        return response
  
    }
  
module.exports = {
  getUserProfile,

  forgotPassword,

  setNewPassword,

  sendOtp,

  confirmOtp
};
