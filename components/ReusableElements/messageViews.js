import { Text } from 'native-base';
import { StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';


export function ErrorMessage({message})
{
    return(

    <Animatable.View animation="fadeInLeft" duration={500}>
        <Text style={styles.errorMsg}>{message}</Text>
    </Animatable.View>
            
            )
}

const styles = StyleSheet.create({
    
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
   
  });
