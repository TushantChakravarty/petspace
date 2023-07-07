import { useNavigation } from "@react-navigation/native";
import { View, Text, useNativeBase } from "native-base";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MyHeader({ Title }) {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <Icon style={{marginLeft:10, marginTop:20}} name="arrow-left-bold" color={"white"} size={30} onPress={()=>{
        navigation.goBack()
      }}/>
      <Text style={{ color: "white", textAlign: "center", width:widthPercentageToDP(30), marginLeft:widthPercentageToDP(35), marginTop:-20 }}>{Title}</Text>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(100),
    backgroundColor: "green",
    display: "flex",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});
