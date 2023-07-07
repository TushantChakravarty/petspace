import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ErrorMessage } from '../components/ReusableElements/messageViews';
import { forgotPassword, getUserProfile, setNewPassword } from './apis/profileApis';
import { url } from './constants/constants';

const ForgotPassword = (props) => {

  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, SetNewPassword] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState(null);
  const [message, setMessage] = useState()
  const [disabled,setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [profilePhotoUri, setProfilePhoto] = useState()
  const [error, setError] = useState({
    invalidPassword:false,
    invalidCredentials:false,
    serverError:false,
    passwordDidNotMatch:false,
    allFieldsError:false
  })
 
  function verifyInput()
  {
    if(currentPassword!=null && newPassword!=null && repeatPassword!=null)
    {

         if(newPassword !== repeatPassword)
        {
            
            setError({
                passwordDidNotMatch:true             
            })
            return
            
        }
        else{
            setError({
                invalidPassword:false,
                invalidCredentials:false,
                serverError:false,
                passwordDidNotMatch:false,
                allFieldsError:false
                        })
            setDisabled(false)
            return
        }
        
    }else{
        setDisabled(true)
            
        setError({
            invalidPassword:false,
            invalidCredentials:false,
            serverError:false,
            passwordDidNotMatch:false,
            allFieldsError:true
                    })
        return
        
    }
  }
  

  const getProfilePhoto = async()=>{
    const emailId = await AsyncStorage.getItem("user")
    console.log(emailId)
    await getUserProfile(emailId)
    .then((response)=>{
        console.log(response.profilePhotoUri)
        setProfilePhoto(response.profilePhotoUri)
    })
  }
  
  const handleSubmit = async () => {
    setLoading(true)
    const emailId = props.route.params.emailId
    console.log(emailId)
    try{

        await forgotPassword(emailId,currentPassword)
        .then(async (responseJson)=>{
            if(responseJson.responseCode===200)
            {
                await setNewPassword(emailId, newPassword)
                .then((responseJson)=>{
                    if(responseJson.responseCode===200)
                    {
                        setLoading(false)
                        props.navigation.navigate('SignInScreen')
                        alert('Password updated successfully')
                        return 
                    }
                    else if(responseJson.responseCode===404){
                        setLoading(false)
                        setMessage('INVALID CREDENTIALS')
                        setError({
                            invalidCredentials:true
                        })
                       return alert('failed to update password')
                    }
                    else if(responseJson.responseCode===400){
                        setLoading(false)
                        setMessage('INVALID CURRENT PASSWORD')
                        setError({
                            invalidPassword:true
                        })
                       return alert('Invalid current password')
                    }
                    else if(responseJson.responseCode===500){
                        setLoading(false)
                        setMessage('INTERNAL SERVER ERROR')
                        setError({
                            serverError:true
                        })
                       return alert('failed to update password')
                    }
                })
                setError({
                    serverError:true
                })
                setMessage('INTERNAL SERVER ERROR')
                return setLoading(false)
            }else if(responseJson.responseCode===404){
                setLoading(false)
                setMessage('INVALID CREDENTIALS')
                setError({
                    invalidCredentials:true
                })
               return alert('failed to update password')
            }
            else if(responseJson.responseCode===400){
                setLoading(false)
                setMessage('INVALID CURRENT PASSWORD')
                setError({
                    invalidPassword:true
                })
               return alert('INVALID CURRENT PASSWORD')
            }
            else if(responseJson.responseCode===500){
                setLoading(false)
                setMessage('INTERNAL SERVER ERROR')
                setError({
                    serverError:true
                })
               return alert('failed to update password')
            }

            setError({
                serverError:true
            })
                setLoading(false)
                setMessage('FAILED TO UPDATE. PLEASE TRY AGAIN')
                return alert('FAILED TO UPDATE. PLEASE TRY AGAIN')
            
        })
    }catch(error){
        setLoading(false)
        alert(error.message)
    }
    }

    useEffect(()=>{
        if(currentPassword!=null && newPassword!=null && repeatPassword!=null)
        {
            verifyInput()
        }
        else{
            setError({
    invalidPassword:false,
    invalidCredentials:false,
    serverError:false,
    passwordDidNotMatch:false,
    allFieldsError:true
            })
        }
    },[currentPassword, newPassword, repeatPassword])

    useEffect(()=>{
        getProfilePhoto()
    },[])
    

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{uri: profilePhotoUri?profilePhotoUri:'https://www.bootdey.com/img/Content/avatar/avatar8.png'}}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Current password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={true}
        />
        <Text style={styles.label}>New password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a new password"
          value={newPassword}
          onChangeText={SetNewPassword}
          secureTextEntry={true}
        />
        <Text style={styles.label}>Repeat new password</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeat your new password"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry={true}
        />
        {
            error.invalidCredentials!=true?null:
            <ErrorMessage message={'invalid credetials'}/>
        }
        {
            error.invalidPassword!=true?null:
            <ErrorMessage message={'invalid current password'}/>
        }
        {
            error.serverError!=true?null:
            <ErrorMessage message={'Internal server error'}/>
        }
        {
            error.allFieldsError!=true?null:
            <ErrorMessage message={'All fields are necessary'}/>
        }
        {
            error.passwordDidNotMatch!=true?null:
            <ErrorMessage message={'Password Did not match'}/>
        }
        <View style={{width:widthPercentageToDP(80), justifyContent:'center', alignContent:'center', alignItems:'center', marginTop:20}}>
        <Button isDisabled={disabled} isLoading={loading} size={"sm"} onPress={handleSubmit} >
            Submit
        </Button>
        </View>
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
  },
  form: {
    width: '80%',
  },
  label: {
    marginTop: 20,
    marginBottom:5
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
    textAlign:'center',
  },
  avatarContainer: {
    marginTop: 10,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ForgotPassword;

