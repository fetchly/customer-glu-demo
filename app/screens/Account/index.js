import React, {useEffect} from 'react';
import {View, StyleSheet, Pressable, FlatList, Platform} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import Feather from 'react-native-vector-icons/Feather';
import {appColors} from '../../utils/appColors';
import Label from '../../components/Label';
import {profileKeys} from '../../utils/MockData';
import AvatarImage from '../../components/AvatarImage';
import {
  BannerWidget,
  dataClear,
  SetCurrentClassName,
} from '@customerglu/react-native-customerglu';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {sendEvent} from '../../services/customerGlu';
import {loginUser} from '../../redux/authAction';
import ReduxWrapper from '../../utils/ReduxWrapper';

  function Account({navigation, auth}) {

  console.log(auth)
  const dispatch = useDispatch();
  const route = useRoute();

  const onLogout = async () => {
    console.log('Clearing data');
    await dataClear();
    console.log('Cleared data');

    dispatch(loginUser({}));
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      SetCurrentClassName(route.name);
    }, [navigation]),
  );

  useFocusEffect(() => {
    sendEvent('viewedProfile');
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
          <Feather name={icon} size={scale(22)} color={appColors.black} />
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
      <View
        style={{
          paddingVertical: scale(20),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <AvatarImage size={scale(110)} />
        <View style={{marginLeft: scale(20)}}>
          <Label text={ auth.user.userId} style={{fontSize: scale(28)}} />
        </View>
      </View>

      <View
        style={[
          {marginTop: 30, zIndex: 10, position: 'relative'},
          Platform.OS == 'ios' && {
            height: 125,
          },
        ]}>
        <BannerWidget bannerId="a86cada9-8c5f-4e8d-a8ea-23bc97ff05e6" />
      </View>

      <FlatList
        data={profileKeys}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <ItemCard key={index} item={item} />}
      />
    </Container>
  );
}

export default ReduxWrapper(Account);


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
