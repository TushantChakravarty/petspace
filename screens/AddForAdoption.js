import { Image, View, Text } from 'native-base';
import Onboarding from 'react-native-onboarding-swiper';
import DetailsScreen from './DetailsScreen';
import ProgressBarMultiStep from "react-native-progress-bar-multi-step";
import { useEffect, useState } from 'react';
import EnterPetDetails from './EnterPetDetails';

export const AddForAdoption = ()=>{
    const [page, setPage] = useState(1);
    const [data, setData] = useState()
    const [disable, setDisable] = useState(true)
    useEffect(()=>{
        console.log(disable)
    },[disable])
    const tabs = [
        {
          title: 'Type and Location',
          pageNo: 1,
        onPress: (e) => {
            //console.log(e)
            setPage(1)
        },
        },
        {title: 'Pet Details', pageNo: 2,
        onPress: (e) => {
            //console.log(e)
            setPage(1)

        }
    }      ];

    return(
        <View>

<ProgressBarMultiStep
    progressive={true}
    page={page}
    setPage={setPage}
    tabs={tabs}
/>
{page===1?<DetailsScreen setDisable={setDisable} setPage={setPage} setData={setData}/>:null}
{page===2?<EnterPetDetails data={data} setPage={setPage}/>:null}
        </View>
        )
}