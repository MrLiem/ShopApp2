import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import ProductItem from "../../components/shop/ProductItem";
import HeaderButton from "../../components/UI/HeaderButton";
import CartButton from '../../components/UI/CartButton'
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inputSearched, setInputSearched] = useState("");
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);

  const [productsSearched, setProductsSearched] = useState([]);

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
    setIsRefreshing(false);
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener(
  //     "willFocus",
  //     loadProducts
  //   );
  //   return () => {
  //     willFocusSub.remove();
  //   };
  // }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [loadProducts]);

  useEffect(() => {
    setProductsSearched(products);
  }, [products]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  const onSearchChange = inputText => {
    // setInputSearched(inputText);

    if (inputText === "") {
      setIsLoading(true);
      loadProducts().then(() => {
        setIsLoading(false);
      });
    }

    if (inputText !== "") {
      const newProductsSearched = productsSearched.filter(el =>
        el.title.includes(inputText)
      );
      setProductsSearched(newProductsSearched);
    }

    // setIsLoading(false);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error ocurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && productsSearched.length === 0) {
    return (
      <View style={{flex:1}}>
        <View style={styles.input}>
          <Ionicons name="md-search" size={32} color="green" />
          <TextInput
            onChangeText={onSearchChange}
            style={styles.inputSearched}
          />
        </View>
        <View style={styles.centered}>
          <Text>No products found. Maybe start adding some!!!</Text>
          <Ionicons
            name="md-refresh"
            size={32}
            color="green"
            onPress={loadProducts}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <View style={styles.input}>
        <Ionicons name="md-search" size={32} color="green" />
        <TextInput onChangeText={onSearchChange} style={styles.inputSearched} />
      </View>
      <FlatList
        // onRefresh={loadProducts}
        // refreshing={isRefreshing}
        data={productsSearched}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button
              color={Colors.primary}
              title="View Details"
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            />
            <Button
              color={Colors.primary}
              title="To Cart"
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
          </ProductItem>
        )}
      />
    </KeyboardAvoidingView>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
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
      <HeaderButtons HeaderButtonComponent={CartButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  input: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginBottom: 20
  },
  inputSearched: {
    width: "70%",
    height: 40,
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginLeft: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductsOverviewScreen;
