/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { WebView } from 'react-native-webview';
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

const App: () => Node = () => {
  /*
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);
  */

  const onShouldStartLoadWithRequest = (event) => {
    if (
        event.url.startsWith('http://') ||
        event.url.startsWith('https://') ||
        event.url.startsWith('about:blank')
      ) {
        return true;
      }
  };

  

  const handleOnMessage = ({ nativeEvent: { data } }) => {
    console.log(data);

    if(data.type == 'REQ_GPS_INFO'){
      Geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            const {latitude, longitude} = position.coords;

            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'RES_GPS_INFO', is_success: true, data: position.coords })
            );
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'RES_GPS_INFO', is_success: false, data: error.message })
            );
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else if(data.type == 'REQ_SIGN_IN_APPLE'){
      onAppleLogin();
    } else if(data.type == 'REQ_SIGN_IN_NAVER'){
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: data.type, is_success: false, reason: '준비중입니다.' })
      );
    } else if(data.type == 'REQ_SIGN_IN_GOOGLE'){
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: data.type, is_success: false, reason: '준비중입니다.' })
      );
    } else if(data.type == 'REQ_SIGN_IN_KAKAO'){
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: data.type, is_success: false, reason: '준비중입니다.' })
      );
    }
  };

  const handleWebViewNavigationStateChange = (newNavState, props) => {
    const { url } = newNavState;
    if (!url) return;
    if (url.includes('nmap://') || url.includes('intent://')) return;
    if (!url.includes('http://') && !url.includes('https://')) return;
    
  };

  return (<WebView
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
