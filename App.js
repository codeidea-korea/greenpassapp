/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useEffect, useState , } from 'react';
import type {Node} from 'react';
import { WebView } from 'react-native-webview';
import NfcManager, {Ndef, NfcEvents} from 'react-native-nfc-manager';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

//import { NaverLogin, getProfile as getNaverProfile } from "@react-native-seoul/naver-login";

import { login as KakaoLogin, getProfile as getKakaoProfile } from "@react-native-seoul/kakao-login";

import appleAuth, {
  appleAuthAndroid,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
  AppleAuthError,
} from '@invertase/react-native-apple-authentication';

// import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import {
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Button,
  AppState,
  View
} from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { Linking} from "react-native";
import linking from "./linking";
import {NavigationContainer} from "@react-navigation/native"



const App :() => Node = () => {
  const myWebWiew = useRef();
  const [NFCURLtag, setNFCURLtag] = useState(null);
  const [swich, setSwich] = useState(0);
  const [naverToken, setNaverToken] = useState(null);

  useEffect(() => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("always");
    }
    if (Platform.OS !== "ios") {
      requestLocationPermission();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      // 퍼미션 요청 다이얼로그 보이기
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        //          Alert.alert('위치정보 사용을 허가하셨습니다.'); //임포트한 Alert를 사용
      } else {
        Alert.alert("위치정보 사용을 거부하셨습니다.\nGPS 인증이 제한됩니다.");
      }
    } catch (err) {
      Alert.alert("퍼미션 작업 에러");
    }
  };

  const sourceUrl = "http://greenpass.codeidea.io/";

  const onShouldStartLoadWithRequest = (event) => {
    if (
      event.url.startsWith("http://") ||
      event.url.startsWith("https://") ||
      event.url.startsWith("about:blank")
    ) {
      return true;
    }
  };

  //const naveriosKeys = {
  //  kConsumerKey: "gubQnwLjz_KP_JLWm_QT",
  //  kConsumerSecret: "9HkLZD91YG",
  //  kServiceAppName: "Greenpass",
  //  kServiceAppUrlScheme: "naverLgn", // only for iOS
  //};
  //
  //const naverandroidKeys = {
  //  kConsumerKey: "gubQnwLjz_KP_JLWm_QT",
  //  kConsumerSecret: "9HkLZD91YG",
  //  kServiceAppName: "Greenpass",
  //};
  //
  //const naverinitials = Platform.OS === "ios" ? naveriosKeys : naverandroidKeys;
  //
  //
  // const naverLogin = (webviewRef, props) => {
  //   return new Promise((resolve, reject) => {
  //     NaverLogin.login(props, (err, token) => {
  ///        Alert.alert(JSON.stringify(token));
  //
  //       setNaverToken(token);
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(token);
  //       getUserProfile(webviewRef);
  //     });
  //   });
  // };
  //
  //  const getUserProfile = async (webviewRef) => {
  //    try{
  //      const profileResult = await getNaverProfile(naverToken.accessToken);
  //
  //      if (profileResult.resultcode === "024") {
  //        Alert.alert("로그인 실패", profileResult.message);
  //        return;
  //      }
  ////      Alert.alert(JSON.stringify(profileResult));
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'N', is_success: true, data: profileResult }
  //      });
  //    }catch(err) {
  //      Alert.alert(JSON.stringify(err));
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'N', is_success: false, data: err }
  //      });
  //    }
  //  };
  //
  //  const onNaverLogin = async (webviewRef) => { await naverLogin(webviewRef, naverinitials); };
  //
  //
  //
  //  useEffect(() => {
  //    GoogleSignin.configure({
  //      webClientId:
  //        "694092036995-bf3nlqrron9b9iqc7n4pi9om7ihtr012.apps.googleusercontent.com",
  //    });
  //  }, []);
  //
  //
  //  const onGoogleLogin = async (webviewRef) => {
  //    try{
  //      const gresponse = await GoogleSignin.signIn();
  //      const googleCredential = auth.GoogleAuthProvider.credential(gresponse.idToken);
  //      const userCredential = await auth().signInWithCredential(googleCredential);
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'G', is_success: true, data: userCredential }
  //      });
  //      Alert.alert(userCredential);
  //    }catch(err) {
  //      Alert.alert(JSON.stringify(err));
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'G', is_success: false, data: err }
  //      });
  //    }
  //  };
  //
  //  const onKakaoLogin = async (webviewRef) => {
  //    try{
  //      const token = await KakaoLogin();
  //      const profile = await getKakaoProfile();
  ////      Alert.alert(profile);
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'K', is_success: true, data: {token:token, profile:profile} }
  //      });
  //    }catch(err){
  //      Alert.alert(JSON.stringify(err));
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'K', is_success: true, false: err }
  //      });
  //    }
  //  };
  //  const onAppleLogin = async (webviewRef) => {
  //    if(!appleAuthAndroid.isSupported){
  //      Alert.alert('애플 로그인을 지원하지 않는 단말입니다.');
  //      return;
  //    }
  //    if(Platform.OS === 'iOS') {
  //      try {
  //        const responseObject = await appleAuth.performRequest({
  //          requestedOperation: AppleAuthRequestOperation.LOGIN,
  //          requestedScopes: [AppleAuthRequestScope.EMAIL],
  //        });
  //        console.log('responseObject:::', responseObject);
  //        const credentialState = await appleAuth.getCredentialStateForUser(
  //          responseObject.user,
  //        );
  //        if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
  //          console.log('user is authenticated');
  //
  //          sendMessage({
  //            webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'A', is_success: true, data: responseObject }
  //          });
  //        }
  //      } catch (error) {
  //        console.log(error);
  //        if (error.code === AppleAuthError.CANCELED) {
  //          console.log('canceled');
  //
  //          sendMessage({
  //            webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'A', is_success: false, data: error }
  //          });
  //        } else {
  //          console.log('error');
  //
  //          sendMessage({
  //            webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'A', is_success: false, data: error }
  //          });
  //        }
  //      }
  //    } else if(Platform.OS === 'android') {
  //      const rawNonce = uuid();
  //      const state = uuid();
  //
  //      // Configure the request
  //      appleAuthAndroid.configure({
  //        // The Service ID you registered with Apple
  //        clientId: 'com.knavigations',
  //
  //        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
  //        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
  //        redirectUri: 'https://do-dream.firebaseapp.com/__/auth/handler',
  //
  //        // The type of response requested - code, id_token, or both.
  //        responseType: appleAuthAndroid.ResponseType.ALL,
  //
  //        // The amount of user information requested from Apple.
  //        scope: appleAuthAndroid.Scope.ALL,
  //
  //        // Random nonce value that will be SHA256 hashed before sending to Apple.
  //        nonce: rawNonce,
  //
  //        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
  //        state,
  //      });
  //
  //      // Open the browser window for user sign in
  //      const response = await appleAuthAndroid.signIn();
  //
  //      sendMessage({
  //        webviewRef, payload: { type: 'SNS_SIGN_IN', dept: 'A', is_success: true, data: response }
  //      });
  //    }
  //  };
  //
  //
  //  const sendMessage = ({payload }) => {
  //
  //      myWebWiew.current.postMessage(JSON.stringify(payload));
  //
  //  };
  //
  //


  async function getIsNFCSupport() {
    try {
      await NfcManager.start();
      await NfcManager.isSupported();
      return true;
    } catch (e) {
      return false;
    }
  }

  async function getIsNFCEnabled() {
    const isIOS = Platform.OS == "ios";
    if (isIOS) {
      return true;
    }
    try {
      const isNFCEnabled = await NfcManager.isEnabled();
      return isNFCEnabled;
    } catch (e) {
      return false;
    }
  }
  const initnfc = async () => {
    const isNFCSupport = await getIsNFCSupport();

    if (isNFCSupport == false) {
      alert("NFC 를 지원하지 않는 단말기 입니다");

      const payload = {
        type: "NFC_ACTION",
        dept: "read",
        is_success: false,
      };

      myWebWiew.current.postMessage(JSON.stringify(payload));

      return false;
    }

    const isNFCEnabled = await getIsNFCEnabled();

    if (isNFCEnabled == false) {
      Alert.alert(
        "NFC가 비활성화 되어 있습니다.",
        "NFC 설정으로 이동하시겠습니까?",
        [
          {
            text: "아니요",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "네", onPress: () => NfcManager.goToNfcSetting() },
        ]
      );
      const payload = {
        type: "NFC_ACTION",
        dept: "read",
        is_success: false,
      };

      myWebWiew.current.postMessage(JSON.stringify(payload));

      return false;
    }
    return true;
  };



  const handleOnMessage = (data) => {
    const { type, dept } = JSON.parse(data);

    if (type == "GPS_INFO") {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const payload = {
            type: "GPS_INFO",
            is_success: true,
            data: position.coords,
          };

          myWebWiew.current.postMessage(JSON.stringify(payload));
        },
        (error) => {
          // See error code charts below.
          const payload = {
            type: "GPS_INFO",
            is_success: false,
            data: error,
          };

          myWebWiew.current.postMessage(JSON.stringify(payload));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else if (type == "SNS_SIGN_IN") {
      if (dept === "A") {
        // onAppleLogin(webviewRef);
      } else if (dept === "G") {
        //  onGoogleLogin(webviewRef);
      } else if (dept === "K") {
        // onKakaoLogin(webviewRef);
      } else if (dept === "N") {
        // onNaverLogin(webviewRef);
      }
    } else if (type == "NFC_ACTION") {
      
      initnfc().then((res) => {
        if (res === false) {
          return;
        }
        if (res === true) {
          if (dept === "read") {
            const readNFC = async () => {
              const cleanUp = () => {
                NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
                NfcManager.setEventListener(NfcEvents.SessionClosed, null);
              };

              return new Promise((resolve) => {
                let tagFound = null;

                NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
                  tagFound = tag;
                  resolve(tagFound);
                  NfcManager.unregisterTagEvent().catch(() => 0);
                });

                NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
                  cleanUp();
                  if (!tagFound) {
                    resolve();
                  }
                });

                NfcManager.registerTagEvent();
              });
            };
            readNFC()
              .then((res) => {
                const parsetext = Ndef.text
                  .decodePayload(res.ndefMessage[0].payload)
                  .split("greenpass://")[1];

                const payload = {
                  type: "NFC_ACTION",
                  dept: "read",
                  is_success: true,
                  data: parsetext,
                };

                myWebWiew.current.postMessage(JSON.stringify(payload));
                setSwich(swich + 1);
              })
              .catch((error) => {
                const payload = {
                  type: "NFC_ACTION",
                  dept: "read",
                  is_success: false,
                  data: error,
                };
                myWebWiew.current.postMessage(JSON.stringify(payload));
              });
          } else if (dept === "detech") {
            NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
            NfcManager.unregisterTagEvent().catch(() => 0);

            const payload = {
              type: "NFC_ACTION",
              dept: "detech",
              is_success: true,
            };
            myWebWiew.current.postMessage(JSON.stringify(payload));
          }
        }
      });
    }
  };

  const useInitialURL = async () => {
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    return null;
  };

  //포그라운드 상태일때 앱을 키면서 온로드에 미리 정보 보내기
  useEffect(() => {
    useInitialURL().then((res) => {
      setNFCURLtag(res.split("greenpass://")[1]);
    });
  }, [NFCURLtag]);


  useEffect(() => {
    initnfc();
  }, []);

  const platforminit = () => {
    const payload = {
      type: "Platform",
      type2: "NFC_ACTION",
      dept: "I",
      data2: NFCURLtag,
      is_success: true,
      data: Platform.OS,
    };

    myWebWiew.current.postMessage(JSON.stringify(payload));
  };
  //포그라운드 상태일때 앱을 키면서 온로드에 미리 정보 보내기

  //백그라운드, 혹은 액티브 상태일때 테그정보를 받아서 신호를 보내기
  useEffect(() => {
    Linking.addEventListener("url", _handlerulStateChange);
    return () => {
      Linking.removeEventListener("url", _handlerulStateChange);
    };
  }, []);
  const _handlerulStateChange = (nfc) => {
    const payload = {
      type: "NFC_ACTION",
      dept: "read",
      data: nfc.url.split("greenpass://")[1],
      is_success: true,
    };

    myWebWiew.current.postMessage(JSON.stringify(payload));
  };
  //백그라운드, 혹은 액티브 상태일때 테그정보를 받아서 신호를 보내기

  
  return (
    <NavigationContainer linking={linking}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <WebView
            ref={myWebWiew}
            originWhitelist={["*"]}
            source={{ uri: sourceUrl }}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            userAgent="Mozilla/5.0 (Linux; Android 11; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36"
            androidHardwareAccelerationDisabled={true}
            onShouldStartLoadWithRequest={(event) => {
              return onShouldStartLoadWithRequest(event);
            }}
            onLoad={() => platforminit()}
            onMessage={(event) => {
              let data = event.nativeEvent.data;
              handleOnMessage(data);
            }}
          />
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};


export default App;
