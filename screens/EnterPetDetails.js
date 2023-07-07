import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import { url } from "./constants/constants";
import {
  generateRandomName,
  getCurrentDate,
} from "../components/utilityFunctions/utilities";
import { Modal, FormControl, Input, Button, ScrollView } from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import { getUserProfile } from "./apis/profileApis";
import { useFocusEffect } from "@react-navigation/native";
import storage from "@react-native-firebase/storage";
import { Image as img } from "react-native-compressor";
import { alert } from "./snackBars/snackBar";
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker,
} from "react-native-settings-components";

const EnterPetDetails = ({ navigation, route, data, setPage }) => {
  const [description, setDescription] = useState("");
  const [age, setAge] = useState();
  const [healthDetails, setHealthDetails] = useState("");
  const [petDetails, setPetDetails] = useState({});
  const [photo, setPhoto] = React.useState([]);
  const [contactNo, setContactNo] = useState();
  const [uploadedPhotoPath, setUploadedPhotoPath] = useState();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postNumber, setPostNumber] = useState();
  const [petName, setPetName] = useState("");
  const [photoUrls, setUrls] = useState();
  const [gender, setGender] = useState("male");
  const colors = {
    white: "#FFFFFF",
    monza: "#C70039",
    switchEnabled: "#C70039",
    switchDisabled: "#efeff3",
    blueGem: "#27139A",
  };

  const onDismiss = () => {
    setVisible(false);
  };

  const checkImagePickerMultiple = () => {
    let photos = [];
    ImagePicker.openPicker({
      multiple: true,
    }).then((images) => {
      console.log(images[0]);
      if (images.length > 1) {
        images.map(async (pics, index) => {
          const name = generateRandomName();
          console.log(name);
          const result = await img.compress(pics.path, {
            compressionMethod: "auto",
          });
          const imageData = {
            name: `${name}.jpeg`,
            type: pics.mime,
            uri: result,
          };
          photos.push(imageData);
        });
        console.log(photos);
        setPhoto(photos);
        console.log(photo);
      }
    });
  };

  const uploadToFirebase = async () => {
    const promises = [];
    let urls = [];
    // const response = //photo.map(async(file) => {
    for (let i = 0; i < photo.length; i++) {
      console.log(photo[i]);
      const storageRef = storage().ref(photo[i].name);

      const uploadTask = await storageRef
        .putFile(photo[i].uri)
        .then((response) => {
          console.log(response);
          //setLoading(false)
        });
      //uploadBytesResumable(storageRef, file);
      const url = await storage()
        .ref(photo[i].name)
        .getDownloadURL();
      urls.push({
        path: url,
      });
      console.log("my download url ", url);
      if (urls.length === photo.length) {
        setLoading(false);
        alert("success", "file uploaded successfully");
        console.log(urls);
        return urls;
      }
    }
    //  })
  };

  const uploadMultiplePhotos = async () => {
    try {
      const data = new FormData();
      //console.log(photo.assets[0].uri,photo.assets[0].type)
      for (let i = 0; i < photo.length; i++) {
        data.append("image", {
          uri: photo[i].uri, // your file path string
          name: photo[i].name,
          type: photo[i].type,
        });
      }
      console.log(data);
      // Please change file upload URL
      let res = await fetch(`${url}/user/multipleupload`, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let responseJson = await res.json();
      if (responseJson.status) {
        console.log(responseJson.data);
        if (responseJson.data.length >= 1) {
          let uploadPaths = [];
          for (let i = 0; i < responseJson.data.length; i++) {
            console.log(responseJson.data[i]);
            uploadPaths.push({
              path: responseJson.data[i].path,
            });
          }
          setUploadedPhotoPath(uploadPaths);
          console.log(uploadedPhotoPath);
          alert("Multiple Upload Successful");
          return uploadPaths;
        }
        setUploadedPhotoPath(responseJson.data);
        alert("Upload Successful");
        return true;
      } else {
        alert("failed to upload pics");
      }
      return res;
    } catch (e) {
      console.log(e);
      alert("failed to upload pics");
    }
  };
  const uploadForAdoption = async (uploadedPhotoPath) => {
    const user = await AsyncStorage.getItem("user");
    const uniqueId = await AsyncStorage.getItem("uniqueId");
    const token = await AsyncStorage.getItem("token");
    const date = getCurrentDate();
    let res = await fetch(`${url}/user/addPost`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        uniqueId: uniqueId,
        user: user,
        postNumber: postNumber,
        pet: data.pet,
        state: data.state,
        city: data.city,
        age: age,
        description: description,
        healthDetails: healthDetails,
        contactNo: contactNo,
        photoUri: uploadedPhotoPath,
        petName: petName,
        date: date,
        gender:gender
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        //console.log(responseJson)
        if (responseJson) {
          if (responseJson.responseCode === 403) {
            //console.log(response)
            alert("error", "invalid Login. Please log in again");
            return;
          }
          if (responseJson.responseCode === 200) {
            //signIn(responseJson.user,responseJson.token)
            //alert('success')
            // navigation.navigate('HomeDrawer')
          }
        }
      });
  };

  const addToAllPosts = async (uploadedPhotoPath) => {
    const user = await AsyncStorage.getItem("user");
    const uniqueId = await AsyncStorage.getItem("uniqueId");
    const fcmKey = await AsyncStorage.getItem("fcmtoken");
    const name = await AsyncStorage.getItem("name");
    const profilePhotoUri = await AsyncStorage.getItem("profilePhotoUri");
    const token = await AsyncStorage.getItem("token");
    const date = getCurrentDate();

    console.log(user);
    let res = await fetch(`${url}/user/allPosts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uniqueId: uniqueId,
        user: user,
        postNumber: postNumber,
        pet: data.pet,
        state: data.state,
        city: data.city,
        age: age,
        description: description,
        healthDetails: healthDetails,
        contactNo: contactNo,
        fcmKey: JSON.parse(fcmKey),
        photoUri: uploadedPhotoPath ? uploadedPhotoPath : "",
        name: JSON.parse(name),
        profilePhotoUri: JSON.parse(profilePhotoUri),
        token: token,
        petName: petName,
        date: date,
        gender:gender
      }),
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        //console.log(responseJson)
        if (responseJson) {
          if (responseJson.responseCode === 403) {
            //console.log(response)
            alert("error", "invalid Login. Please log in again");
            return;
          }
          if (responseJson.responseCode === 200) {
            //signIn(responseJson.user,responseJson.token)
            alert("success", "Post Added Successfully");

            // navigation.navigate('HomeDrawer')
          }
        }
      });
  };

  const getPostNumber = () => {
    AsyncStorage.getItem("user").then(async (response) => {
      console.log("My emailId", response);
      await getUserProfile(response).then((response) => {
        if (response.responseCode === 403) {
          //console.log(response)
          alert("invalid Login. Please log in again");
          return;
        }
        console.log("my profile details", response);
        const postNumber = response.posts.length;
        console.log(postNumber);
        setPostNumber(postNumber);
      });
    });
  };

  useEffect(() => {
    console.log(data);
    setPetDetails(data);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getPostNumber();
    }, [])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Enter details for {data.pet}</Text>
        
        <View style={styles.container}>
        <View style={{display:'flex',flexDirection:'row', borderWidth:1, borderColor:'black'}}>
           <SettingsPicker
            title="Select pet Gender"
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
            styleModalButtonsText={{ color: colors.blueGem }}
            />
        
            </View>
          
          <TextInput
            style={styles.contact}
            placeholder={`Your Pet Name`}
            onChangeText={(input) => {
              setPetName(input);
            }}
            value={petName}
          />
          <TextInput
            style={styles.description}
            placeholder={`please enter details about the ${data.pet}`}
            onChangeText={(input) => {
              setDescription(input);
            }}
          />

          <TextInput
            style={styles.age}
            placeholder={`${data.pet}'s age`}
            keyboardType="numeric"
            onChangeText={(input) => {
              setAge(input);
            }}
          />

          <TextInput
            style={styles.contact}
            placeholder={`Your Contact No`}
            keyboardType="numeric"
            onChangeText={(input) => {
              setContactNo(input);
            }}
          />
          <View style={{ marginTop: 20 }}>
            <Text style={{ textAlign: "center" }}>Any health issues?</Text>
            <TextInput
              style={styles.description}
              placeholder={`Write about any health issues the ${
                data.pet
              } might have?`}
              onChangeText={(input) => {
                setHealthDetails(input);
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={() => {
                //handleChoosePhoto()
                checkImagePickerMultiple();
              }}
            >
              Add Pics
            </Button>
          </View>
         
          <View style={{ marginTop: 10 }}>
            <Button
              onPress={async () => {
                if(description&&petName&&healthDetails&&gender&&age&&contactNo&&photo.length!==0)
                {
                  setVisible(true);
                }
                else{
                  alert('error','All fields are necessary')
                  return
                }
                /* await uploadForAdoption()
                .then((response)=>{
                  console.log(response)
                })
                await addToAllPosts()
                .then((response)=>{
                  console.log(response)
                  
                })*/

                /* await uploadMultiplePhotos()
                .then(async (response)=>{
                  console.log(response)
                  if(response){
                    await uploadForAdoption()
                .then((response)=>{
                  console.log(response)
                })
                await addToAllPosts()
                .then((response)=>{
                  console.log(response)
                  
                })
                
                  }
                })
                .finally(()=>{
                  
                  navigation.navigate('HomeDrawer')
                })*/
                /* await  uploadMultiplePhotos()
               .then((response)=>{
                console.log(response)
               })*/
              }}
            >
              Add for adoption
            </Button>
          </View>
        </View>

        <Modal
          isOpen={visible}
          onClose={() => setVisible(false)}
          avoidKeyboard
          justifyContent="flex-end"
          bottom="400"
          size="400"
          style={{
            height: heightPercentageToDP(100),
            marginTop: heightPercentageToDP(50),
          }}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Post Preview</Modal.Header>
            <Modal.Body>
              Please confirm the details of your post before posting
              <SliderBox images={photo} />
              <FormControl mt="3">
                <FormControl.Label>PET</FormControl.Label>
                {data.pet}
                <FormControl.Label>Pet Gender</FormControl.Label>
                {gender}
                <FormControl.Label>NAME</FormControl.Label>
                {petName}
                <FormControl.Label>Description</FormControl.Label>
                {description}
                <FormControl.Label>Health Details</FormControl.Label>
                {healthDetails}
                <FormControl.Label>State</FormControl.Label>
                {data.state}
                <FormControl.Label>City</FormControl.Label>
                {data.city}
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button
                flex="1"
                isLoading={loading}
                onPress={async () => {
                  setLoading(true);
                  try {
                    await uploadToFirebase()
                      .then(async (response) => {
                        console.log("My urls", response);
                        if (response) {
                          await uploadForAdoption(response).then((response) => {
                            console.log(response);
                          });
                          await addToAllPosts(response).then((response) => {
                            console.log(response);
                          });
                        }
                      })
                      .catch((e) => {
                        setLoading(false);
                      })
                      .finally(() => {
                        setVisible(false);
                        setLoading(false);
                        setPage(1);
                        navigation.navigate("Adopt");
                      });
                  } catch (e) {
                    setLoading(false);
                  }

                  /* setTimeout(async () => {
                  await uploadMultiplePhotos()
                    .then(async (response) => {
                      console.log(response);
                      if (response) {
                        await uploadForAdoption(response).then((response) => {
                          console.log(response);
                        });
                        await addToAllPosts(response).then((response) => {
                          console.log(response);
                        });
                      }
                    })
                    .finally(() => {
                      navigation.navigate("HomeDrawer");
                      setVisible(false);
                      setLoading(false);
                    });
                }, 1);*/
                }}
              >
                Proceed
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default EnterPetDetails;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingBottom: 60,
  },
  container2: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    width: wp(80),
    height: hp(20),
    marginTop: 10,
  },
  age: {
    width: wp(20),
    height: hp(10),
    marginTop: 10,
  },
  contact: {
    width: wp(50),
    height: hp(10),
    marginTop: 10,
  },
});
/*

  const uploadPhotos = async () => {
    try {
      const data = new FormData();
      console.log(photo.assets[0].uri, photo.assets[0].type);
      data.append("image", {
        uri: photo.assets[0].uri, // your file path string
        name: photo.assets[0].fileName,
        type: photo.assets[0].type,
      });
      console.log(data);
      // Please change file upload URL
      let res = await fetch(`${url}/user/uploadPhotos`, {
        method: "POST",
        body: data,
      });
      let responseJson = await res.json();
      if (responseJson.status) {
        console.log(responseJson.data.path);
        setUploadedPhotoPath(responseJson.data.path);
        alert("Upload Successful");
        return true;
      } else {
        alert("failed to upload pics");
      }
      return res;
    } catch (e) {
      console.log(e);
      alert("failed to upload pics");
    }
  };


*/
