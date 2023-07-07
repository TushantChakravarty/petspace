import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { generateRandomName, getCities } from '../components/utilityFunctions/utilities';
import CityDropdownComponent from '../components/ReusableElements/Citydropdown';
import { stateData, url } from './constants/constants';
import DropdownComponent from '../components/ReusableElements/Dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from "react-native-image-crop-picker";
import { Image as img} from "react-native-compressor";
import storage from "@react-native-firebase/storage";
import { ActivityIndicator } from 'react-native-paper';
import {alert} from './snackBars/snackBar'

const CreateProfile = ({navigation}) => {
  const profile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Software engineer and cat lover',
    avatar: 'https://example.com/jane-doe-avatar.png',
  }
  const[state, setState] = useState('')
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(profile.avatar);
  const [profilePhotoUri, setProfilePhotoUri] = useState(profile.avatar)
  const [cityDropdown, setCityDropDown] = useState(false)
  const [cityData, setCity] = useState()
  const [city, selectCity] = useState()
  const [loading, setLoading] = useState(false)
  const[photo, setPhoto] = useState()
  

  const handleChoosePhoto = async () => {
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
    });  };

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
      alert('success',"file uploaded successfully");
      console.log(url);
      if (url) {
        setLoading(false)
      }
      return url;
  
      //  })
    };
  


  const uploadProfilePhoto = async () => {
    try{
      const data = new FormData();
      console.log(photo.assets[0].uri,photo.assets[0].type)
      data.append('image', {
        uri: photo.assets[0].uri, // your file path string
        name: photo.assets[0].fileName,
        type: photo.assets[0].type
      })
      console.log(data)
      // Please change file upload URL
      let res = await fetch(
        `${url}/user/uploadProfilePhoto`,
        {
          method: "POST",
          body: data,
        });;
        let responseJson = await res.json();
        if (responseJson.status) {
          console.log(responseJson.data.path)
          setProfilePhotoUri(responseJson.data.path)
          alert('Upload Successful');
          return true
        }
        else{
          alert('failed to upload pics')
        }
        return res
      }catch(e){
        console.log(e)
        alert('failed to upload pics')
      }
    }
  
    const uploadProfileDetails =async (emailId,profilePhotoUri) =>{
      const uniqueId = Math.floor(Math.random()*90000) + 10000;
      //const token = await AsyncStorage.getItem('token')

      const response =await fetch(`${url}/user/createProfile`,{
        method: 'POST',
        headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
        },
       body: JSON.stringify({
        emailId: emailId,
        name: name,
        state:state,
      city:city,
      phoneNumber:phoneNumber,
      bio:bio,
      profilePhotoUri:profilePhotoUri,
      uniqueId:uniqueId
      
                 })
       }).then((response) => response.json())
       .then(async (responseJson) => {
        console.log(responseJson)
        if(responseJson){
            if(responseJson.responseCode===200)
            {
                alert('success','Profile Details Updated')
                AsyncStorage.setItem('uniqueId',JSON.stringify(uniqueId))
                navigation.navigate('SignInScreen')
            }
        }
        
        
      })
    }

  const handleSubmit = async (uri) => {
    const emailId = await AsyncStorage.getItem('user')
    try{

      uploadProfileDetails(JSON.parse(emailId),uri)
    }catch(e){
      console.log(e)
    }
  }



  useEffect( ()=>{
    console.log(state)
    const getData = async (state) =>{

      
       await getCities(state)
      .then((response)=>{
        if(response.data){
         // console.log(response.data)
          let city =[]
          let data = []
          data.push(JSON.parse(response.data))
          // data.push(response.data)
           console.log(data)
          

            data[0]?data[0].map((item)=>{
              city.push({label:item.name, value:item.name})
              
            }):null
        
          setCity(city)
          setCityDropDown(true)
        }else{
          setCityDropDown(false)
        }
        
      }).catch((e)=>{
        console.log(e)
      })
      

        
    }
    getData(state)
  },[state])

  

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{uri: photo?photo.uri:'https://www.bootdey.com/img/Content/avatar/avatar3.png'}}
        />
        <TouchableOpacity style={styles.changeAvatarButton} onPress={() => {
          console.log(photo)
          handleChoosePhoto()}}>
          <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Bio"
          value={bio}
          onChangeText={setBio}
        />
        <View style={styles.container2}>
          <Text>Select a state</Text>
          <DropdownComponent data={stateData} placeholder={'Select State'} setState={setState}  state={state} />
        </View>
        {cityDropdown===true?<View style={styles.container2}>
          <Text>Select a city</Text>
          <CityDropdownComponent data={cityData} placeholder={'Select city'} setCity={selectCity}  City={city} />
        </View>:<View></View>} 
     
        <TouchableOpacity style={styles.button} onPress={async () => {
         await uploadToFirebase()
         .then((response)=>{

           handleSubmit(response)
        })
        }}>
          <Text style={styles.buttonText}>{loading?<ActivityIndicator size={'small'} color={'white'}/>:'Submit'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '80%',
  },
  label: {
    marginTop: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    alignContent:'center',
    textAlign:'center'
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarButtonText: {
    color: '#1E90FF',
    fontSize: 18,
  },
  container2: {
    display:'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  dropdown:{
    width:100
  }
});

export default CreateProfile;

