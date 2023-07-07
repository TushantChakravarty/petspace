import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker,
} from "react-native-settings-components";
import {
  generateRandomName,
  getCities,
} from "../components/utilityFunctions/utilities";
import { stateData, url } from "./constants/constants";
import { Button } from "native-base";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { Image as img} from "react-native-compressor";
import { Modal, FormControl, Input, Center } from "native-base";
import { confirmOtp, getUserProfile, sendOtp } from "./apis/profileApis";
import { ErrorMessage } from "../components/ReusableElements/messageViews";
import { AuthContext } from "../components/context";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {alert} from './snackBars/snackBar'


const SettingsScreen = () => {
  const [username, setUserName] = useState();
  const [emailId, setEmailId] = useState();
  const [password, setPassword] = useState();
  const [cityData, setCityData] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [Bio, setBio] = useState();
  const [gender, setGender] = useState();
  const [pushNotification, allowPushNotifications] = useState(false);
  const [photo, setPhoto] = useState();
  const [cityDropdown, setCityDropDown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({

  })
  const [profilePhoto, setProfilePhoto] = useState(
    "https://bootdey.com/img/Content/avatar/avatar1.png"
  );
  const [newData, setNewData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const colors = {
    white: "#FFFFFF",
    monza: "#C70039",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
  };

  const getCityData = async (State) => {
    if (state != null) {
      await getCities(State)
        .then((response) => {
          if (response.data) {
            // console.log(response.data)
            let city = [];
            let data = [];
            data.push(JSON.parse(response.data));
            // data.push(response.data)

            data[0]
              ? data[0].map((item) => {
                  city.push({ label: item.name, value: item.name });
                })
              : null;

            setCityData(city);
            setCityDropDown(true);
          } else {
            setCityDropDown(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  async function updateProfile(newData, profilePhotoUri) {
    const emailId = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem('token')
    console.log("New Data", newData);
    const finalData = {};
    finalData.emailId = emailId;
    if (newData.emailId) {
      finalData.emailId = newData.emailId;
    }
    if (profilePhotoUri) {
      finalData.profilePhotoUri = profilePhotoUri;
    }
    if (newData.username) {
      finalData.name = newData.username;
    }
    if (newData.password) {
      finalData.password = newData.password;
    }
    if (newData.city) {
      finalData.city = newData.city;
    }
    if (newData.state) {
      finalData.state = newData.state;
    }
    if (newData.Bio) {
      finalData.Bio = newData.Bio;
    }
    console.log("Final Data", finalData);

    await fetch(`${url}/user/updateProfile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: finalData,
        token:token
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
        if (responseJson) {
          if(responseJson.responseCode===403)
        {
          //console.log(response)
          alert("error",'invalid Login. Please log in again')
          return
        }
          if (responseJson.responseCode === 200) {
            alert("success","Profile Details Updated");
            setLoading(false);
            // navigation.navigate('SignInScreen')
          }
        }
      });
  }

  const pickProfilePhoto = () => {
    ImagePicker.openPicker({
      multiple: false,
    }).then(async (image) => {
      console.log(image);
      const name = generateRandomName();
      console.log(name);
      const result = await img.compress(image.path, {
        compressionMethod: "auto",
      });
      console.log("compressed result",result);
      const imageData = {
        name: `${name}.jpeg`,
        type: image.mime,
        uri: result,
      };

      console.log(imageData);

      setPhoto(imageData);
    });
  };

  const uploadToFirebase = async () => {
    setLoading(true);
    const storageRef = storage().ref(photo.name);

    const uploadTask = await storageRef.putFile(photo.uri).then((response) => {
      console.log(response);
      //setLoading(false)
    });
    //uploadBytesResumable(storageRef, file);
    const url = await storage()
      .ref(photo.name)
      .getDownloadURL();
    console.log("my download url ", url);
    alert("success","file uploaded successfully");
    console.log(url);
    if (url) {
      setNewData({
        ...newData,
        profilePhotoUri: url,
      });
    }
    return url;

    //  })
  };

  const setProfileData = async ()=>{
    const emailId = await AsyncStorage.getItem('user')
    await getUserProfile(emailId)
      .then((response)=>{
        if(response.responseCode===403)
        {
          //console.log(response)
          alert("error",'invalid Login. Please log in again')
          return
        }
        console.log("my profile details", response)
        setProfile({
        emailId: response.emailId,
        name: response.name,
        state:response.state,
      city:response.city,
      phoneNumber:response.phoneNumber,
      bio:response.bio,
      profilePhotoUri:response.profilePhotoUri
      
        })
        })
    
  }
 


  const ChangePassword = ({showModal, setShowModal}) => {
    const [isOtpSent, setOtpSent] = useState(false)
    const [email,setEmail] = useState()
    const [isLoading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [otp,setOtp] = useState()
    const [message, setMessage]=useState('')
    const navigation = useNavigation() 
    const [error, setError] = useState({
      email:null,
      otp:null
    })
    
    const SendOtp = async ()=>{
      const emailId = await AsyncStorage.getItem('user')
      await sendOtp(emailId,emailId)
      .then((response)=>{
        console.log(response)
        if(response.responseCode===200)
        {
          setOtpSent(true)
        }
        else{
          setError({
            email:true
          })
          setMessage(response.responseMessage)
        }
      })
    }

    useEffect(()=>{
      if(isOtpSent)
      {
        setDisabled(false)
      }
      else{
        setDisabled(true)
      }
    },[isOtpSent])
    

    useEffect(()=>{
      if(showModal)
      {
        SendOtp()
      }
    },[])
  
    return <Center>
        <Modal isOpen={showModal}  onClose={() => {
          setShowModal(false)
          setOtpSent(false)
        
        }} _backdrop={{
        _dark: {
          bg: "coolGray.800"
        },
        bg: "warmGray.50"
      }}>
          <Modal.Content maxWidth="350" maxH="800">
            <Modal.CloseButton />
            <Modal.Header>Change Password</Modal.Header>
            <Modal.Body>
              {error.email?<ErrorMessage message={message}/>:null}
              {!isOtpSent&&(
                <ActivityIndicator size={'small'} color={'green'}/>
              )}
              {isOtpSent?
              <FormControl mt="3">
              <FormControl.Label>OTP</FormControl.Label>
              <Input onChangeText={(value)=>{
                setOtp(value)
              }}/>
              </FormControl>
              :null}
              {error.otp?<ErrorMessage message={message}/>:null}
  
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost"  colorScheme="blueGray" onPress={() => {
                setShowModal(false);
              }}>
                  Cancel
                </Button>
                <Button disabled={disabled} style={{backgroundColor:disabled?'grey':'green'}} isLoading={isLoading} onPress={async() => {
                //setShowModal(false);
                const emailId = await AsyncStorage.getItem('user')
                setLoading(true)
                if(isOtpSent)
                {
                  await confirmOtp(emailId,otp)
                  .then(async (response)=>{
                    if(response.responseCode===200)
                    {
                      setLoading(false)
                      setOtpSent(false)
                      setShowModal(false)
                      navigation.navigate('ChangePassword',{
                        emailId:emailId
                      })
                     
                    }
                    else{
                      setError({
                        otp:true
                      })
                      setMessage(response.responseMessage)
                    
                    }
   
                  })
                }
                else{
                  setError({
                    email:true
                  })
                  setMessage('please wait for otp to be sent')
                }
              }}>
                 {!isOtpSent? 'Save':'verify' }
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>;
  };

  

  useEffect(() => {
    getCityData(state);
  }, [state]);

  useEffect(() => {
    if (username ||  city || state || Bio || photo) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [username, city, state, Bio, photo]);

useEffect(()=>{
  setProfileData()
},[])

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          Platform.OS === "ios" ? colors.iosSettingsBackground : colors.white,
      }}
    >
      <SettingsCategoryHeader
        title={"My Account"}
        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
      />
      <View
        style={{
          display: "flex",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={styles.avatar}
          source={{
            uri: profile.profilePhotoUri
              ? profile.profilePhotoUri
              : "https://bootdey.com/img/Content/avatar/avatar1.png",
          }}
        />
        <TouchableOpacity
          onPress={() => {
            pickProfilePhoto();
          }}
        >
          <Text style={{ color: "blue" }}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      <SettingsDividerLong android={false} />
      <SettingsEditText
        title="Username"
        dialogDescription={"Enter your username."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        buttonRightTitle={"Save"}
        onValueChange={(value) => {
          if (value) {
            setNewData({
              ...newData,
              username: value,
            });
          } else {
            setNewData({
              ...newData,
              username: null,
            });
          }
          setUserName(value);
        }}
        value={username?username:profile.name}
      />
      <SettingsDividerShort />
      <SettingsPicker
        title="State"
        dialogDescription={"Choose your state."}
        options={stateData}
        onValueChange={(value) => {
          if (value) {
            setNewData({
              ...newData,
              state: value,
            });
          } else {
            setNewData({
              ...newData,
              state: null,
            });
          }
          setState(value);
        }}
        value={state?state:profile.state}
        styleModalButtonsText={{ color: colors.monza }}
      />
      <SettingsDividerShort />
      {cityDropdown ? (
        <SettingsPicker
          title="City"
          dialogDescription={"Choose your city."}
          options={cityData}
          onValueChange={(value) => {
            if (value) {
              setNewData({
                ...newData,
                city: value,
              });
            } else {
              setNewData({
                ...newData,
                city: null,
              });
            }
            setCity(value);
          }}
          value={city?city:profile.city}
          styleModalButtonsText={{ color: colors.monza }}
        />
      ) : (
        <View
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text>To change city, please select a state first</Text>
        </View>
      )}
      <SettingsDividerShort />
      <SettingsEditText
        title="Bio"
        dialogDescription={"Enter your Bio."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        buttonRightTitle={"Save"}
        onValueChange={(value) => {
          if (value) {
            setNewData({
              ...newData,
              Bio: value,
            });
          } else {
            setNewData({
              ...newData,
              Bio: null,
            });
          }
          setBio(value);
        }}
        value={Bio?Bio:profile.bio}
      />
      <SettingsDividerShort />
      {disabled == false ? (
        <View
          style={{
            width: widthPercentageToDP(100),
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Button
            isLoading={isLoading}
            style={{ backgroundColor: "#27139A" }}
            onPress={async () => {
              // await updateProfile(newData);
              console.log(photo);
              if(photo){

                await uploadToFirebase().then(async (response) => {
                  await updateProfile(newData, response);
                });
              }else{
                await updateProfile(newData);

              }
            }}
          >
            Submit
          </Button>
        </View>
      ) : (
        <View />
      )}
      <SettingsPicker
        title="Gender"
        dialogDescription={"Choose your gender."}
        options={[
          { label: "...", value: "" },
          { label: "male", value: "male" },
          { label: "female", value: "female" },
          { label: "other", value: "other" },
        ]}
        onValueChange={(value) => {
          setGender(value);
        }}
        value={gender}
        styleModalButtonsText={{ color: colors.monza }}
      />
      <SettingsCategoryHeader
        title={"Account Security and Privacy"}
        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
      />
      <TouchableOpacity style={{display:'flex', flexDirection:'row'}} disabled={true} onPress={()=>{
       // setShowModal(true)
      }}>
        <Text style={{color:'black', margin:15}}>Email</Text>
        <Text style={{marginLeft:widthPercentageToDP( 40), color:'grey',marginTop:10}}>{emailId?emailId:'tushant029@gmail.com'}</Text>
      </TouchableOpacity>
 
       <SettingsDividerShort />
       <TouchableOpacity style={{display:'flex', flexDirection:'row'}}  onPress={()=>{
        setShowModal(true)
      }}>
        <Text style={{color:'black', margin:15}}>PASSWORD</Text>
        <Text style={{marginLeft:widthPercentageToDP( 40), color:'grey',marginTop:10}}>{password?password:'XXXXXXXXX'}</Text>
      </TouchableOpacity>
 
      <SettingsDividerShort />
      <SettingsCategoryHeader
        title={"App Settings"}
        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
      />
     <SettingsSwitch
        title={"Allow Push Notifications"}
        onValueChange={(value) => {
          console.log("allow push notifications:", value);
          allowPushNotifications(!pushNotification);
        }}
        value={pushNotification}
        trackColor={{
          true: colors.switchEnabled,
          false: colors.switchDisabled,
        }}
      />
   <ChangePassword showModal={showModal} setShowModal={setShowModal} />
    </ScrollView>
  );
};
/*
 <TouchableOpacity onPress={()=>{
        setShowModal(true)
      }}>
        <Text style={{color:'black', margin:15}}>Email</Text>
        <Text>{emailId?emailId:''}</Text>
      </TouchableOpacity>
     
<ChangeEmail showModal={showModal} setShowModal={setShowModal} setEmailId={setEmailId}/>
const ChangeEmail = ({showModal, setShowModal, setEmailId}) => {
  const [isOtpSent, setOtpSent] = useState(false)
  const [email,setEmail] = useState()
  const [isLoading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [otp,setOtp] = useState()
  const [message, setMessage]=useState('')
  const { signOut, toggleTheme } = React.useContext(AuthContext);

  const [error, setError] = useState({
    email:null,
    otp:null
  })
  useEffect(()=>{
    if(email)
    {
      setDisabled(false)
    }
    else{
      setDisabled(true)
    }
  },[email])

  return <Center>
      <Modal isOpen={showModal}  onClose={() => setShowModal(false)} _backdrop={{
      _dark: {
        bg: "coolGray.800"
      },
      bg: "warmGray.50"
    }}>
        <Modal.Content maxWidth="350" maxH="800">
          <Modal.CloseButton />
          <Modal.Header>Change Email</Modal.Header>
          <Modal.Body>
          <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input onChangeText={(value)=>{
                if(value)
                {
                  setEmailId(value)
                  setEmail(value)
                  
                }else{
                  setEmailId(null)
                  setEmail(null)
                  
                }
              }}/>
            </FormControl>
            {error.email?<ErrorMessage message={message}/>:null}

            {isOtpSent?
            <FormControl mt="3">
            <FormControl.Label>OTP</FormControl.Label>
            <Input onChangeText={(value)=>{
              setOtp(value)
            }}/>
            </FormControl>
            :null}
            {error.otp?<ErrorMessage message={message}/>:null}

          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost"  colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
              <Button disabled={disabled} style={{backgroundColor:disabled?'grey':'green'}} isLoading={isLoading} onPress={async() => {
              //setShowModal(false);
              const emailId = await AsyncStorage.getItem('user')
              setLoading(true)
              if(email&&!isOtpSent)
              {
                await sendOtp(emailId,email)
                .then((response)=>{
                  console.log(response)
                  if(response.responseCode===200)
                  {
                    setOtpSent(true)
                    setLoading(false)
                  }
                  else{
                    setError({
                      email:true
                    })
                    setMessage(response.responseMessage)
                    setLoading(false)

                  }
                })
              }else if(isOtpSent)
              {
                await confirmOtp(emailId,otp,email)
                .then(async (response)=>{
                  if(response.responseCode===200)
                  {
                    setLoading(false)
                    setOtpSent(false)
                    setEmailId(email)
                    setShowModal(false)
                    AsyncStorage.setItem('user',email)
                    alert('Email Changed successfully')
                    signOut()
                    await AsyncStorage.removeItem('userToken')
                
                  }
                  else{
                    setError({
                      otp:true
                    })
                    setMessage(response.responseMessage)
                  
                  }
 
                })
              }
              else{
                setError({
                  email:true
                })
                setMessage('please enter a valid email to proceed')
              }
            }}>
               {!isOtpSent? 'Save':'verify' }
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>;
};

 <SettingsEditText
        title="Password"
        dialogDescription={"Enter your password."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        buttonRightTitle={"Save"}
        onValueChange={(value) => {
          if (value) {
            setNewData({
              ...newData,
              password: value,
            });
          } else {
            setNewData({
              ...newData,
              password: null,
            });
          }
          setPassword(value);
        }}
        value={password}
      />
*/
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
});
