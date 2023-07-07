import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropdownComponent from '../components/ReusableElements/Dropdown';
import { getCities } from '../components/utilityFunctions/utilities';
import CityDropdownComponent from '../components/ReusableElements/Citydropdown';
import { ErrorMessage } from '../components/ReusableElements/messageViews';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from './constants/colors';

const DetailsScreen = ({navigation, setDisable, setPage, setData}) => {
  const [state, setState] = useState('')
  const [pet, setPet] = useState('')
  const [cityDropdown, setCityDropDown] = useState(false)
  const [cityData, setCity] = useState()
  const [city, selectCity] = useState()
  const [message, setMessage]=useState('')
  const [error, setError] = useState(false)
  const [selectedCategoryIndex, setSeletedCategoryIndex] = React.useState();

  const Navigation = useNavigation()

  const petCategories = [
    { name: "Cat", icon: "cat" },
    { name: "Dog", icon: "dog" },
    { name: "Bird", icon: "bird" },
    { name: "Bunnies", icon: "rabbit" },
    {name:"Cow/Buffalo", icon:'cow'},
    {name:'Fish', icon:"fish"},
    {name:'Turtle', icon:"turtle"}
  
    
  ];
  

  const animalData = [
    { label: 'Cat', value: '1' },
    { label: 'Dog', value: '2' },
    { label: 'Bird', value: '3' },
    { label: 'Cow/Buffalo', value: '5' },
    { label: 'Turtle', value: '6' },
    { label: 'Fish', value: '7' },
    { label: 'Bunnies', value: '7' },

  ];
  const stateData =[
   {label:'Arunachal Pradesh',value:'AR'},
   {label:'Assam',value:'AS'},
   {label:'Bihar',value:'BR'},
   {label:'Punjab',value:'PB'},
   {label:'Rajasthan',value:'RJ'},
   {label:'Odisha',value:'OR'},
   {label:'Nagaland',value:'NL'},
   {label:'Chhattisgarh',value:'CT'},
   {label:'Arunachal Pradesh',value:'AP'},
   {label:'Delhi',value:'DL'},
   {label:'Goa',value:'GA'},
   {label:'Gujarat',value:'GJ'},
   {label:'Haryana',value:'HR'},
   {label:'Himachal Pradesh',value:'HP'},
   {label:'Jammu & Kashmir',value:'JK'},
   {label:'Jharkhand',value:'JH'},
   {label:'Karnataka',value:'KA'},
   {label:'Kerala',value:'KL'},
   {label:'Maharashtra',value:'MH'},
   {label:'Madhya Pradesh',value:'MP'},
   {label:'Manipur',value:'MN'},
   {label:'Meghalaya',value:'ML'},
   {label:'Mizoram',value:'MZ'},
   {label:'Sikkim',value:'SK'},
   {label:'Tamil Nadu',value:'TN'},
   {label:'Tripura',value:'TR'},
   {label:'Uttar Pradesh',value:'UP'},
   {label:'Uttarakhand',value:'UT'},
   {label:'West Bengal',value:'WB'},
   {label:'Andaman & Nicobar (UT)',value:'AN'}
  ]
   const renderItem = (item) => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value === value && (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
        </View>
      );
    };
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
    try{

      getData(state)
    }catch(e){
      console.log(e)
    }
  },[state])

  

    return (
      <View style={styles.container}>
        <Text>Add animal for adoption</Text>
        <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {petCategories.map((item, index) => (
              <View key={"pet" + index} style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    setSeletedCategoryIndex(index);
                    setPet(item.name)
                  }}
                  style={[
                    styles.categoryBtn,
                    {
                      backgroundColor:
                        selectedCategoryIndex == index
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={30}
                    color={
                      selectedCategoryIndex == index
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                </TouchableOpacity>
                <Text style={styles.categoryBtnName}>{item.name}</Text>
              </View>
            ))}
          </View>

         
        
        <View style={styles.container}>
          <DropdownComponent data={stateData} placeholder={'Select State'} setState={setState}  state={state} />
        </View>
        {cityDropdown===true?<View style={styles.container}>
          <CityDropdownComponent data={cityData} placeholder={'Select city'} setCity={selectCity}  City={city} />
        </View>:<View></View>}
        <Button title='Next' onPress={()=>{
          const data = {
            pet:pet,
            city:city,
            state:state
          }
          console.log(data)
          if(pet&&city&&state)
          {
            setError(false)
            setDisable(false)
           /* Navigation.navigate('EnterPetDetails',{
              data
            })*/
            setData(data)
            setPage(2)
          }else{
            setPage(1)
            setMessage('Please select all details')
            setError(true)
            return
          }
        }} ></Button>
       {error && (
        <ErrorMessage message={message}/>
       )} 
       
      </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    display:'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  dropdown:{
    width:100
  },
  categoryBtn: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  categoryBtnName: {
    color: COLORS.dark,
    fontSize: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  
  });
/*
<View>
          <DropdownComponent data={animalData} placeholder={'Select a Pet'}  setPet={setPet}  pet={pet}/>
        </View>
*/