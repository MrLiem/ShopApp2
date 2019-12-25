import React from "react";
import { Platform, View, Text } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import {useSelector} from 'react-redux'

const CartButton = props => {
    const cart= useSelector(state=>state.cart.items);
    // console.log(cart);

    let num=0;
    for(const key in cart){
        // console.log(cart[key].quantity)
        num+=cart[key].quantity;
    }
  return (
    <View style={{flexDirection:'row'}}>
      <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={23}
        color={Platform.OS === "android" ? "white" : Colors.primary}
      />
      <Text style={{color:'white'}}>({num})</Text>
    </View>
  );
};

export default CartButton;
