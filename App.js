import React, {Component} from 'react';
import {StyleSheet, View, Button, TouchableOpacity, Text} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import LinkedInModal from 'react-native-linkedin';
import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';

GoogleSignin.configure({
  webClientId:
    '941917286127-sbaabdmlp8hnjf8ukd6htooui68triov.apps.googleusercontent.com',
});

export default class Main extends React.Component {
  onGooglePress = async () => {
    await this.onGoogleButtonPress().then(() =>
      console.log('Signed in with Google!'),
    );
  };

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  onFaceBookPress = async () => {
    await this.onFacebookButtonPress().then(result =>
      console.log('Signed in with Facebook!', result),
    );
  };

  onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  logoutWithFacebook = () => {
    LoginManager.logOut();
  };

  linkedRef = React.createRef();

  logoutWithLinkedin = async () => {
    CookieManager.clearAll();
  };
  onSuccessLinkedinLogin = async token => {
    console.log('####test', token.access_token);
    const headers = {
      // 'Content-Type': 'application/json',
      // Authorization: token.access_token,
      // Authorization: 'Bearer ' + token.access_token,
      'Content-Type': 'application/json',
      'x-li-format': 'json',
      Authorization: "Bearer " + token.access_token,
    };
    const param = {
      q: 'members',
      projection: '(elements*(handle~))',
    };
    axios
      .get(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: headers,
        },
      )
      .then(response => {
        // console.log('####email', response.data.ele ments[0]['handle~'].emailAddress);
      })
      .catch(error => {
        console.log('####error', error);
      });
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {/* google */}
        <Button onPress={this.onGooglePress} title="google signin" />
        <Text>{''}</Text>
        {/* facebook */}
        <Button onPress={this.onFaceBookPress} title="facebook signin 1" />
        <Text>{''}</Text>
        <Button onPress={this.logoutWithFacebook} title="facebook logout" />
        <Text>{''}</Text>
        {/* linkedin */}
        <LinkedInModal
          ref={this.linkedRef}
          // shouldGetAccessToken={false}
          clientID="78pm2g3m1yfza6"
          clientSecret="Edgt0T4tr3FlUSdT"
          redirectUri="https://api.linkedin.com/v2/me"
          linkText="Continue with Linkedin"
          onSuccess={token => this.onSuccessLinkedinLogin(token)}
        />
        <Button
          onPress={() => this.linkedRef.current.open()}
          title="linkedin signin "
        />
        <Text>{''}</Text>
        <Button title="Linkedin Log Out" onPress={this.logoutWithLinkedin} />

        {/* <LinkedInModal
                ref={this.linkedRef}
                clientID="..."
                clientSecret="..."
                redirectUri="https://www.linkedin.com/developer/apps"
                onSuccess={token => this.linkedinLogin(token.access_token)}
                linkText="Continue with Linkedin"
                renderButton={this.renderButton}
            /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
