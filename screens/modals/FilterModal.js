import { Center, VStack, Skeleton, Modal, Button, View, ScrollView, Text } from "native-base";
import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";
const { height } = Dimensions.get("window");

export const FilterModal = ({showModal, setShowModal, petCategories, filterPet}) => {
    const [selectedCategoryIndex, setSeletedCategoryIndex] = useState(0);

    return <Center>
        <Button onPress={() => setShowModal(true)}>Button</Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} _backdrop={{
        _dark: {
          bg: "coolGray.800"
        },
        bg: "warmGray.50"
      }}>
          <Modal.Content maxWidth="350" maxH="212">
            <Modal.CloseButton />
            <Modal.Header>Pet Filter</Modal.Header>
            <Modal.Body>
            <ScrollView
            horizontal={true}
            contentContainerStyle={{flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
            width:400
        }}
            
          >
            {petCategories.map((item, index) => (
              <ScrollView key={"pet" + index} 
              contentContainerStyle={{display:'flex',alignItems: "center", margin:2}}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSeletedCategoryIndex(index);
                    filterPet(index);
                  }}
                  style={[
                    style.categoryBtn,
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
                <Text style={style.categoryBtnName}>{item.name}</Text>
              </ScrollView>
            ))}
          </ScrollView>

              </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>;
  };


  const style = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.light,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: 20,
      paddingHorizontal: 20,
      paddingVertical: 40,
      minHeight: height,
    },
    searchInputContainer: {
      height: 50,
      backgroundColor: COLORS.white,
      borderRadius: 7,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
    cardContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    cardDetailsContainer: {
      backgroundColor: COLORS.white,
      flex: 1,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      padding: 20,
      justifyContent: "center",
    },
    cardImageContainer: {
      height: 150,
      width: 140,
      backgroundColor: COLORS.background,
      borderRadius: 20,
    },
    dropdownContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      alignContent: "center",
    },
    scrollContainer:{
      alignItems: "center",
      justifyContent: "center",
    },
  });
  