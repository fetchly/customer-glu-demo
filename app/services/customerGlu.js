import {RegisterDevice} from '@customerglu/react-native-customerglu';
import {useCallback} from 'react';
import {Alert, Linking} from 'react-native';

export async function register(userData) {
  console.log('Registering device');
  var ok = await RegisterDevice(userData);
  console.log('Registered');
  if (ok == true) {
    console.log('Success');
  } else {
    console.log('Fail');
  }
  return ok;
}
