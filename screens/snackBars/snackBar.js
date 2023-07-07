import Snackbar from 'react-native-snackbar';

function alert(type,message){
    if(type=='success')
    {

        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor:'green',
            
        });
    }else{
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor:'red'
        });
    }
        
}

module.exports={
    alert
}