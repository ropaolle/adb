import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAtNXWmXp1afYAGQ51aXdyCR4WRc42ViN4',
  authDomain: 'artdatabanken.firebaseapp.com',
  databaseURL: 'https://artdatabanken.firebaseio.com',
  projectId: 'artdatabanken',
  storageBucket: 'artdatabanken.appspot.com',
  // messagingSenderId: '495647184718',
};

firebase.initializeApp(config);

export const database = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const storage = firebase.storage().ref();

export const loadImages = () => database.collection('images')
  .get()
  .then((querySnapshot) => {
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({ name: doc.id, url: doc.data().downloadURL, uploaded: true });
    });
    console.log('Loaded images', images.length);

    return images;
  });

export const uploadImages = (fileArr, updateState) => Promise.all(
  fileArr.map((file, i) => {
    const uploadTask = storage.child(`images/${file.name}`).put(file);
    uploadTask.on(
      'state_changed',
      (/* snapshot */) => {},
      (error) => {
        console.log('Image upload error', error);
      },
      () => {
        // Save downloadURL in database
        const { downloadURL, metadata } = uploadTask.snapshot;
        database
          .collection('images')
          .doc(metadata.name)
          .set({ downloadURL });
        // Update page state
        updateState(i, downloadURL, metadata.name);
      },
    );

    return uploadTask;
  }),
);

export const storeFamilies = (families) => {
  database
    .collection('families')
    .doc('default')
    .set({ families });
};

export const loadFamilies = () => database.collection('families').doc('default')
  .get()
  .then((snapshot) => {
    if (!snapshot.exists) return [];
    const { families } = snapshot.data();
    console.log('Loaded families', families);

    return families;
  });
