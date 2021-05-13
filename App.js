import React, {Component} from 'react';
import {StyleSheet, View, Button, TouchableOpacity, Text} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import LinkedInModal from 'react-native-linkedin'

// FacebookSdk.sdkInitialize(getApplicationContext());

GoogleSignin.configure({
  webClientId:
    '941917286127-sbaabdmlp8hnjf8ukd6htooui68triov.apps.googleusercontent.com',
});


export default class Main extends React.Component {

  onGooglePress = async () => {
    await this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'));
  };

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  onFaceBookPress = async () => {
    await this.onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'));
  };
  
  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  linkedRef = React.createRef()

  logoutWithFacebook = () => {
    LoginManager.logOut();
    this.setState({userInfo: {}});
  };

  render() {

    return (
      <View style={{ flex: 1, alignItems:'center', justifyContent:'center'}}>
        <Button onPress={this.onGooglePress} title='google signin' />
        <Text>{''}</Text>
        <Button onPress={this.onFaceBookPress} title='facebook signin 1' />
        <Text>{''}</Text>
        <Button onPress={this.loginWithFacebook} title='facebook signin 2' />
        <Text>{''}</Text>
        <LinkedInModal
          ref={this.linkedRef}
          clientID="78pm2g3m1yfza6"
          clientSecret="Edgt0T4tr3FlUSdT"
          redirectUri="https://gofile.io"
          onSuccess={token => console.log('####test',token)}
        />

        {/* <LinkedInModal
                ref={this.linkedRef}
                clientID="..."
                clientSecret="..."
                redirectUri="https://www.linkedin.com/developer/apps"
                onSuccess={token => this.linkedinLogin(token.access_token)}
                linkText="Continue with Linkedin"
                renderButton={this.renderButton}
            /> */}

{/* onPress={() => this.linkedRef.current.open()}> */}

        {/* <Button title="Log Out" onPress={this.linkedRef.current.logoutAsync()} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
