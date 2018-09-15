import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FirebaseServiceProvider {

  constructor(public http: Http, public firebaseNative: Firebase, public afs: AngularFirestore,
    private platform: Platform) {
    console.log('Inside FirebaseServiceProvider Provider for Push FCM');
  }

  // Get permission from the user
  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }
    if (this.platform.is('cordova')) {
      //diff for web PWA
      console.log("Inside browser platform in firebase-service");
    }

    return this.saveTokenToFirestore(token)
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;
    const devicesCollection = this.afs.collection('devices')
    const docData = {
      token,
      userId: 'testUser',//hardcoded for one id - user unique authId
    }
    return devicesCollection.doc(token).set(docData)
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
    //diff for web PWA
  }

}
