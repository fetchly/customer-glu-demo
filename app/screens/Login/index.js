import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {scale} from 'react-native-size-matters';
import Container from '../../components/Container';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Label from '../../components/Label';
import {appColors, shadow} from '../../utils/appColors';
import auth from '@react-native-firebase/auth';
import {AlertHelper} from '../../utils/AlertHelper';
import {CommonActions} from '@react-navigation/native';

import googleLogin from '../../services/googleLogin';
import writeData from '../../utils/writeData';
import ReduxWrapper from '../../utils/ReduxWrapper';
import {register} from '../../services/customerGlu';

function index({getProductsList$, loginUser$, navigation}) {
  const [credentials, setCredentials] = useState({
    userId: '', // Mandatory:any identifier to uniquely identify a user of your platform
    firebaseToken: 'FCM_TOKEN_OF_DEVICE', // for enabling Firebase Notifications
    apnsDeviceToken: 'APN_TOKEN_OF_DEVICE', // for enabling APN Notifications only for IOS
    customAttributes: {
      // any custom key-value pairs, which may be used for targeting can be sent as customAttributes
      // segments can be created by applying filters on these customAttributes
      // campaigns can be launched on specific segments
      orderCount: 5,
      city: 'Mumbai',
    },
    profile: {
      firstName: 'JaneDoe',
    },
  });
  const [isloading, setisloading] = useState(false);

  const onGoogleLogin = async () => {
    const {user, additionalUserInfo} = await googleLogin();
    const {email, displayName, userId, photoURL} = user;
    if (additionalUserInfo?.isNewUser) {
      const {providerId, profile} = additionalUserInfo;
      //create new user and login
      await writeData('users', {
        email,
        name: displayName,
        userId,
        photoURL,
        providerId,
        profile,
      });
    }
    getProductsList$();
    loginUser$({email, name: displayName, userId, photoURL});
  };
  const onLogin = async () => {
    //auth().signOut()
    const {userId} = credentials;

    try {
      if (userId) {
        setisloading(true);
        const success = await register(credentials);
        console.log('status', success);
        if (success) {
          // loginUser$({
          //   email: user?.email,
          //   name: user?.displayName ? user?.displayName : 'User',
          //   userId: user?.userId,
          // });
          getProductsList$();
          AlertHelper.show('success', 'Welcome to Amusoftech');
          navigation.navigate('Home');
        }
      } else {
        setisloading(false);
        AlertHelper.show('error', 'User ID is required!!');
      }
    } catch (error) {
      AlertHelper.show('error', 'Something went woring');
    }
  };

  const onChangeText = (name, text) => {
    setCredentials({...credentials, [name]: text});
  };

  return (
    <Container isScrollable>
      <View
        style={{
          marginTop: scale(50),
          backgroundColor: appColors.white,
          ...shadow,
          padding: scale(15),
          borderRadius: scale(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Label
            text="Welcome,"
            style={{fontSize: scale(30), fontWeight: '700'}}
          />
          {/* <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Label
              text="Register User"
              style={{
                fontSize: scale(14),
                fontWeight: '500',
                color: appColors.primary,
              }}
            />
          </Pressable> */}
        </View>
        <View style={{paddingVertical: scale(15)}}>
          <Label
            text="Sign in to Continue"
            style={{
              fontSize: scale(16),
              //fontWeight: '500',
              color: appColors.darkGray,
            }}
          />
        </View>
        <View style={{paddingVertical: scale(10)}}>
          <CustomInput
            onChangeText={(text) => onChangeText('userId', text)}
            label="User Id"
            placeholder="Input here"
          />
        </View>
        {/* <Pressable
          onPress={() => navigation.navigate('Verification')}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingVertical: scale(10),
          }}></Pressable> */}
        <CustomButton isLoading={isloading} onPress={onLogin} label="Sign in" />
      </View>
    </Container>
  );
}

export default ReduxWrapper(index);
