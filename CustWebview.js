import { WebView } from 'react-native-webview';

const CustWebview = ({ webviewRef, handleOnMessage }) => {

    const sourceUrl = 'http://greenpass.codeidea.io/';
    
    const onShouldStartLoadWithRequest = (event) => {
        if (
            event.url.startsWith('http://') ||
            event.url.startsWith('https://') ||
            event.url.startsWith('about:blank')
        ) {
            return true;
        }
    };

    return (<WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{uri: sourceUrl}}
        style={{marginTop: 0}}
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

export default CustWebview;