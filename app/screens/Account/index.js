/* eslint-disable react-hooks/rules-of-hooks */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Linking,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {appColors} from '../../utils/appColors';
import Label from '../../components/Label';
import {profileKeys} from '../../utils/MockData';
import AvatarImage from '../../components/AvatarImage';
import auth from '@react-native-firebase/auth';
import {
  BannerWidget,
  dataClear,
  sendData,
  SetCurrentClassName,
} from '@customerglu/react-native-customerglu';
import {useFocusEffect, useRoute} from '@react-navigation/native';

//auth().signOut()
export default function index({navigation}) {
  const [deepLink, setDeepLink] = useState('');
  const onLogout = () => {
    auth().signOut();
    dataClear();
  };

  // for Pop ups
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      SetCurrentClassName(route.name);
    }, [navigation]),
  );

  // Sending Data
  // eslint-disable-next-line react-hooks/exhaustive-deps

  async function sendData$() {
    let userData = {
      eventName: 'viewedProfile',
      eventProperties: {
        accountName: 'Amusoftech',
        accountEmail: 'amusoftech@gmail.com',
      },
    };
    console.log('Sending event about viewed profile');
    await sendData(userData);
    console.log('Finished sending event');
  }
  useEffect(() => {
    sendData$();
  }, []);

  const ItemCard = ({item}) => {
    const {lebel, icon, isNew, route, customIcon, action} = item;
    return (
      <Pressable
        onPress={() => {
          route == 'Login' && onLogout();
          action && action();
          route && navigation.navigate(route);
        }}
        style={styles.itemContainer}>
        <Pressable style={styles.iconContainer}>
          {customIcon ? (
            <Entypo
              name={customIcon}
              size={scale(22)}
              color={appColors.black}
            />
          ) : (
            <Feather name={icon} size={scale(22)} color={appColors.black} />
          )}
        </Pressable>
        <View style={styles.itemInnerContainer}>
          <Label text={lebel} />
          {isNew && (
            <View
              style={{
                paddingHorizontal: scale(10),
                backgroundColor: appColors.red,
                padding: scale(5),
                borderRadius: scale(4),
              }}>
              <Label
                text="New"
                style={{fontSize: scale(10), color: appColors.white}}
              />
            </View>
          )}
          <Feather name={'chevron-right'} size={scale(18)} />
        </View>
      </Pressable>
    );
  };
  return (
    <Container>
      <BannerWidget bannerId="a86cada9-8c5f-4e8d-a8ea-23bc97ff05e6" />

      <View
        style={{
          paddingVertical: scale(20),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <AvatarImage size={scale(110)} />
        <View style={{marginLeft: scale(20)}}>
          <Label text="Amusoftech" style={{fontSize: scale(28)}} />
          <Label text="amusoftech@gmail.com" style={{fontSize: scale(12)}} />
        </View>
      </View>
      <BannerWidget bannerId="010101" />

      <FlatList
        data={profileKeys}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <ItemCard key={index} item={item} />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: scale(15),
  },
  itemInnerContainer: {
    flex: 1,

    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    borderRadius: scale(5),
    padding: scale(10),
    marginRight: scale(20),
    backgroundColor: appColors.lightGreen,
  },
});
