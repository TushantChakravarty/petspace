import React,{useEffect, useState} from 'react';
import { 
    View, 
    Text,
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from './constants/constants';
import { ActivityIndicator } from 'react-native-paper';
import { confirmOtp,  sendOtp } from "./apis/profileApis";
import { Modal, FormControl, Input, Center } from "native-base";
import { Button } from "native-base";
import { useNavigation } from '@react-navigation/native';
import {alert} from './snackBars/snackBar'

const SignInScreen = ({navigation}) => {
    const [ loading, setLoading] = useState(false)
    const [showModal,setShowModal] = useState(false)
    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const signUp =async () =>{
        setLoading(true)
      const response =await fetch(`${url}/user/register`,{
        method: 'POST',
        headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/json'
        },
       body: JSON.stringify({
        emailId: data.username,
        password: data.password
                 })
       }).then((response) => response.json())
       .then(async (responseJson) => {
        console.log(responseJson)
        if(responseJson){
            if(responseJson.responseCode===200)
            {
                setLoading(false)
                AsyncStorage.setItem('user',JSON.stringify(data.username))
                setShowModal(true)
                //navigation.navigate('CreateProfile')
            }
        }
        
        
      })
    }

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const VerifyEmail = ({showModal, setShowModal, emailId}) => {
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
                <Modal.Header>Verify Email</Modal.Header>
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
                          navigation.navigate('CreateProfile')
                         
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
    
      
    

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
            <Text style={styles.text_footer}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {
                        signUp()
                    }}
                >
                <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>{ loading?<ActivityIndicator size={'small'} color={'white'}/>: 'Sign Up'}</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>
        <VerifyEmail showModal={showModal} setShowModal={setShowModal} emailId={data.username}/>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
