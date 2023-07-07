import { Platform } from 'react-native';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


export const generateRandomName = ()=>{
  const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
  return randomName
}

export const getCities = async  (state) => {

var headers = new Headers();
headers.append("X-CSCAPI-KEY", "RlE3YmZFRk41T094UUVzalZTWFZ6dnR0SDNIN0tDeGJsQVAxTTFwYw==");

var requestOptions = {
 method: 'GET',
 headers: headers,
 redirect: 'follow'
};

const response = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${state}/cities`, requestOptions)
.then(response => response.text())
.then(result => {
    console.log(result)
    if(result){

        return {msg:'Success', data:result}
    }
    else{
        return {msg:'failure' , data:null}
    }
} )
.catch(error => console.log('error', error));

return response
}

export const createFormData = (photo, body = {}) => {
    const data = new FormData();
  
    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
  
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  
    return data;
  };
  
  export const getCurrentDate = ()=>{
    var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  var d = new Date();
const date = new Date()
const day = date.getDate()
const month = monthNames[d.getMonth()]
const year = date.getFullYear()
const fullDate = `${day} ${month} ${year}`
return fullDate
  }