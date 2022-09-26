import {RegisterDevice} from '@customerglu/react-native-customerglu';
import {useCallback} from 'react';
import {Alert, Linking} from 'react-native';

let userData = {
  userId: '121', // Mandatory:any identifier to uniquely identify a user of your platform
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
};

export async function register() {
  console.log('Registering device');
  var ok = await RegisterDevice(userData);
  console.log('Registered');
  if (ok == true) {
    console.log('Success');
  } else {
    console.log('Fail');
  }
}
