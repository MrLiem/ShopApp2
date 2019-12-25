import React, { useEffect, useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import * as productActions from '../../store/actions/products'
import Colors from "../../constants/Colors";
const ProfileScreen = props => {
  const [isLoading,setIsLoading]=useState(false);
  const user = useSelector(state => state.auth);
  const product = useSelector(state => state.products.userProducts);
  const [name, setName] = useState(user.name);

  const dispatch = useDispatch();
  // console.log(user.imageUrl)
 
  useEffect(()=>{
    setIsLoading(true);
    dispatch(productActions.fetchProducts()).then(()=>{
      setIsLoading(false);
    })
  },[setIsLoading])

  
  const handleInputText = inputName => {
    setName(inputName);
  };
  useEffect(() => {
    props.navigation.setParams({ update: updateProfile });
  }, [updateProfile, name]);

  const updateProfile = useCallback(() => {
    Alert.alert("Profile status","Saved!!!",[{text: 'OK', style: "success",}])
    dispatch(
      authActions.updateUser(
        user.id,
        user.userId,
        user.token,
        user.email,
        name,
        user.dateJoined,
        user.imageUrl
      )
    );
  }, [name]);


  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.screen}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: `${
                  user.imageUrl
                    ? user.imageUrl
                    : "http://bootdey.com/img/Content/avatar/avatar7.png"
                }`
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{ width: "95%" }}>
            <Text style={styles.textContent}>Gmail:</Text>
            <View>
            <Text style={styles.textInfo}>{user.email}</Text>
            </View>
            <Text style={styles.textContent}>UserId:</Text>
            <View>
              <Text style={styles.textInfo}>{user.userId}</Text>
            </View>
            <Text style={styles.textContent}>Name:</Text>
            <View>
              <TextInput
                style={styles.textInfo}
                value={name}
                onChangeText={handleInputText}
              />
            </View>
            <Text style={styles.textContent}>Date joined:</Text>
            <View>
              <Text style={styles.textInfo}>{user.dateJoined.toString()}</Text>
            </View>
            <Text style={styles.textContent}>Number of products:</Text>
            <View>
              <Text style={styles.textInfo}>{product.length}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center"
    // padding: 10
  },
  imageContainer: {
    alignItems: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    marginVertical: 20
  },
  image: {
    width: "100%",
    height: "100%"
  },
  textContent: {
    fontSize: 20
  },
  textInfo: {
    width: "100%",
    height: 30,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 10
  },
  centered:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});

ProfileScreen.navigationOptions = navData => {
  const updateFn = navData.navigation.getParam("update");
  return {
    headerTitle: "Your Profile",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-save" : "ios-save"}
          onPress={updateFn}
        />
      </HeaderButtons>
    )
  };
};

export default ProfileScreen;
