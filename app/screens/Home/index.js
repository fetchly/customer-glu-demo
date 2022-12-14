/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList, Platform} from 'react-native';
import {} from 'react-native-gesture-handler';
import {categoriesList} from '../../utils/MockData';
import {appColors, shadow} from '../../utils/appColors';
import TouchableRipple from 'react-native-touch-ripple';
import Label from '../../components/Label';
import Container from '../../components/Container';
import Product from '../../components/ProductCard';
import {scale} from 'react-native-size-matters';
import SearchBox from '../../components/SearchBox';
import TitleComp from '../../components/TitleComp';
import ReduxWrapper from '../../utils/ReduxWrapper';
import {
  RegisterDevice,
  setApnFcmToken,
  SetCurrentClassName,
} from '@customerglu/react-native-customerglu';

import {useFocusEffect, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Banner from '../../components/Banner';

function Home({
  getProducts$,
  getProductsList$,
  navigation,
  auth,
  products: {products},
}) {
  async function updateToken() {
    let token = await AsyncStorage.getItem('token');
    token = JSON.parse(token);
    let user = {...auth.user};

    if (!token?.token) {
      console.log("Notification token doesn't exist");
      return;
    }

    if (token.os == 'android') {
      user.firebaseToken = token.token;
    } else {
      user.apnsDeviceToken = token.token;
      await setApnFcmToken(user.apnsDeviceToken,"");
    }

    console.log(`Updating user`, user);
    RegisterDevice(user);
  }

  useFocusEffect(
    React.useCallback(() => {
      SetCurrentClassName(route.name);
    }, []),
  );

  useEffect(() => {
    getProductsList$();
    updateToken();
  }, []);

  const RenderTitle = ({heading, rightLabel}) => {
    return <TitleComp heading={heading} rightLabel={rightLabel} />;
  };
  const ProductCard = ({item}) => {
    return <Product navigation={navigation} item={item} />;
  };

  const route = useRoute();

  return (
    <Container isScrollable>
      <SearchBox onFoucs={() => navigation.navigate('Search')} />

      <View
        style={[
          {marginTop: 30, zIndex: 10, position: 'relative'},
          Platform.OS == 'ios' && {
            height: 125,
          },
        ]}>
        <Banner bannerId="homescreen_banner" />
      </View>

      <View style={{paddingVertical: scale(30)}}>
        <RenderTitle heading="Categories" />

        <FlatList
          style={{marginTop: scale(40)}}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={categoriesList}
          ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const {label, Icon} = item;
            return (
              <View style={{alignItems: 'center'}}>
                <TouchableRipple
                  onPress={() => {
                    getProducts$(label);
                    navigation.navigate('Category', {item});
                  }}
                  rippleColor={appColors.primary}
                  rippleContainerBorderRadius={scale(40)}
                  rippleDuration={800}
                  style={{
                    ...shadow,
                    backgroundColor: appColors.white,
                    height: scale(70),
                    width: scale(70),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: scale(40),
                  }}>
                  <Icon />
                </TouchableRipple>
                <View style={{marginTop: scale(15)}}>
                  <Label text={label} style={{fontSize: scale(14)}} />
                </View>
              </View>
            );
          }}
        />
      </View>
      <View>
        <View style={{paddingVertical: scale(25)}}>
          <RenderTitle heading="Best Selling" rightLabel="See All" />
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{padding: scale(10)}} />}
          horizontal
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <ProductCard item={item} />}
        />
      </View>
    </Container>
  );
}

export default ReduxWrapper(Home);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  header: {
    backgroundColor: appColors.primary,
    alignItems: 'center',
    borderBottomWidth: 12,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    padding: 20,
    margin: 20,
    textAlign: 'center',
  },
  TitleText: {
    fontSize: 25,
    // padding: 20,
    marginVertical: 20,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
