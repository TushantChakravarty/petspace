import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../components/context';
import { ActivityIndicator } from 'react-native-paper';
import Users from '../model/users';
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../components/Redux/actions/auth'
import { getUserProfile } from './apis/profileApis';
import { ErrorMessage } from '../components/ReusableElements/messageViews';
import { confirmOtp,  sendOtp } from "./apis/profileApis";
import { Modal, FormControl, Input, Center } from "native-base";
import { Button } from "native-base";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {alert} from './snackBars/snackBar'

const SignInScreen = ({navigation}) => {
    const dispatch = useDispatch()
    const [showModal,setShowModal]= useState(false)
    const state = useSelector((state) => state)
    const[isLoggedIn,setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidEmail:true,
        isValidPassword: true,
    });

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }


    const onLogin =async (userName,password) =>{
        setLoading(true)
        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        const user = {
            username:userName,
            password:password
        }
        console.log(user)
        try{

            dispatch(login(user))
            .then(async (response)=>{
                console.log(response)
                if(response){
                    
                    if(response.status==='success'){
                        //alert('success')
                        console.log(userName)
                        if(response?.isEmailVerified==='true')
                        {
                            console.log(response.token)
                            if(response.token)
                            {
                                AsyncStorage.setItem('token',response.token)
                                setLoading(false)
                                await signIn(userName);
                                return
                            }
                            else{
                                setLoading(false)

                                alert("error",'Error loggin in, Please try again')
                                return
                            }
                        }
                        else if(response.status==='invalid'){
                            setLoading(false)

                            alert('error','please provide valid details')
                            return
                        }
                        else{
                            setLoading(false)
                            setShowModal(true)
                        }
                        
                    }else{
                        setLoading(false)
                        alert('erro',response.message)
                    }
                }
            })
            
        }catch(e){
            console.log(e)
            setLoading(false)

            alert("error",e.message)
        }
        }

    const VerifyEmail = ({showModal, setShowModal, emailId}) => {
        const [isOtpSent, setOtpSent] = useState(false)
        const [isLoading, setLoading] = useState(false)
        const [disabled, setDisabled] = useState(true)
        const [otp,setOtp] = useState()
        const [message, setMessage]=useState('')
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
                          await signIn(emailId?emailId:data.username);
                         
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
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
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
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
            </Animatable.View>
            }
            { data.isValidEmail ? null : 
            <ErrorMessage message={'User does not exist'}/>
            }

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
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
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }
            

            <TouchableOpacity onPress={async ()=>{
                if(!data.username){
                    return alert('Please enter emailId to reset password')
                }
                await getUserProfile(data.username)
                .then((response)=>{
                    console.log(response)
                    if(response === undefined)
                    {
                        
                        setData({
                            ...data,
                            isValidEmail:false
                        })
                        
                    }
                    else{
                        navigation.navigate('forgotPassword',{
                            emailId:data.username
                        })
                    }
                })
                /**/
            }}>
                <Text style={{color: '#009387', marginTop:15}}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {
                     
                        onLogin(data.username,data.password)
                         /*dispatch(login(user))
                         .then((respnse))*/
                    }}
                >
                <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>{loading?<ActivityIndicator size={'small'} color={'white'}/>:
                    'Sign In'}</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
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
        flex: 3,
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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
    }
  });
