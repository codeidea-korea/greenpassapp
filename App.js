/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useEffect, useState } from 'react';
import type {Node} from 'react';
import { WebView } from 'react-native-webview';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { NaverLogin, getProfile as getNaverProfile } from "@react-native-seoul/naver-login";

import { login as KakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  PermissionsAndroid, Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const sourceUrl = 'http://greenpass.codeidea.io/';

const requestLocationPermission = async () => {
  try{
      // 퍼미션 요청 다이얼로그 보이기
      const granted=await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if(granted== PermissionsAndroid.RESULTS.GRANTED){
          Alert.alert('위치정보 사용을 허가하셨습니다.'); //임포트한 Alert를 사용
      }else{
          Alert.alert('위치정보 사용을 거부하셨습니다.\nGPS 인증이 제한됩니다.');
      }
  }catch(err){
    Alert.alert('퍼미션 작업 에러');
  }
}

const onGoogleLogin = async () => {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = auth().signInWithCredential(googleCredential);
  
  window.postMessage(
    JSON.stringify({ type: 'SNS_SIGN_IN', dept: 'G', is_success: true, data: userCredential })
  );
}

const naveriosKeys = {
  kConsumerKey: "gubQnwLjz_KP_JLWm_QT",
  kConsumerSecret: "9HkLZD91YG",
  kServiceAppName: "Greenpass",
  kServiceAppUrlScheme: "naverLgn" // only for iOS
};

const naverandroidKeys = {
  kConsumerKey: "gubQnwLjz_KP_JLWm_QT",
  kConsumerSecret: "9HkLZD91YG",
  kServiceAppName: "Greenpass"
};

const naverinitials = Platform.OS === "ios" ? naveriosKeys : naverandroidKeys;

const onKakaoLogin = async () => {
  const token = await KakaoLogin();
  setResult(JSON.stringify(token));
  const profile = await getKakaoProfile();
  
  window.postMessage(
    JSON.stringify({ type: 'SNS_SIGN_IN', dept: 'G', is_success: true, data: {token:token, profile:profile} })
  );
}

const App: () => Node = () => {
  let webviewRef = useRef();
  /*
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);
  */
  const [naverToken, setNaverToken] = React.useState(null);
  
 useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '812443649010-4g89se134trtf9amlhdt8crpcml9tb59.apps.googleusercontent.com'
    });
  }, []);
  
  const getUserProfile = async () => {
    const profileResult = await getNaverProfile(naverToken.accessToken);
    if (profileResult.resultcode === "024") {
      Alert.alert("로그인 실패", profileResult.message);
      return;
    }
    console.log("profileResult", profileResult);
    window.postMessage(
      JSON.stringify({ type: 'SNS_SIGN_IN', dept: 'N', is_success: true, data: profileResult })
    );
  };

  const naverLogin = props => {
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, (err, token) => {
        console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
        setNaverToken(token);
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
        getUserProfile();
      });
    });
  };

  const onNaverLogin = () => naverLogin(naverinitials);


  const onShouldStartLoadWithRequest = (event) => {
    if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
        return true;
      }
  };
  const initNFC = () => {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.warn('tag', tag);
  //          NfcManager.setAlertMessageIOS('I got your tag!');
      NfcManager.unregisterTagEvent().catch(() => 0);
      
      window.postMessage(
        JSON.stringify({ type: 'NFC_ACTION', dept: 'read', is_success: true, data: tag })
      );
    });
  };
  initNFC();

  const handleOnMessage = ({ nativeEvent: { data } }) => {
    console.log(data);

    if(data.type == 'GPS_INFO'){
      Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            const {latitude, longitude} = position.coords;

            window.postMessage(
              JSON.stringify({ type: 'GPS_INFO', is_success: true, data: position.coords })
            );
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            
            window.postMessage(
              JSON.stringify({ type: 'GPS_INFO', is_success: false, data: error.message })
            );
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else if(data.type == 'SNS_SIGN_IN'){
      const dept = data.dept;
      if(dept === 'A') {
//        onAppleLogin();
      } else if(dept === 'G') {
        onGoogleLogin();
      } else if(dept === 'K') {
        onKakaoLogin();
      } else if(dept === 'N') {
        onNaverLogin();
      }
    } else if(data.type == 'NFC_ACTION'){
      const dept = data.dept;
      if(dept === 'read') {
        const readNFC = async() => {
          try {
            await NfcManager.registerTagEvent();
          } catch (ex) {
            console.warn('ex', ex);
            NfcManager.unregisterTagEvent().catch(() => 0);
          }
        };
      } else if(dept === 'detech') {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.unregisterTagEvent().catch(() => 0);
        
        window.postMessage(
          JSON.stringify({ type: 'NFC_ACTION', dept: 'detech', is_success: true })
        );
      }
    }
  };

  const handleWebViewNavigationStateChange = (newNavState, props) => {
    const { url } = newNavState;
    if (!url) return;
    if (url.includes('nmap://') || url.includes('intent://')) return;
    if (!url.includes('http://') && !url.includes('https://')) return;
    
  };

  return (<WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{uri: sourceUrl}}
          style={{marginTop: 0}}
          userAgent='Mozilla/5.0 (Linux; Android 11; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36'
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          useWebKit={true}
          androidHardwareAccelerationDisabled 
          onShouldStartLoadWithRequest={event => {
            return onShouldStartLoadWithRequest(event);
          }}
          onMessage={handleOnMessage}
      />);
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
