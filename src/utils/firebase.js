import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDsrPH_fYtKmLvDaidU1HKsfA9uKkyVHq0',
  authDomain: 'budget-ec3f9.firebaseapp.com',
  databaseURL: 'https://budget-ec3f9.firebaseio.com',
  projectId: 'budget-ec3f9',
  storageBucket: 'budget-ec3f9.appspot.com',
  messagingSenderId: '47147422899',
};

firebase.initializeApp(config);

export const database = firebase.firestore();
// export const firebaseAuth = firebase.auth;
export const storage = firebase.storage().ref();

// Database paths
// export const DB_USERS = 'users';
// export const DB_BUDGET_COLLECTION = 'budget';
// export const DB_EXSPENSES_COLLECTION = 'expenses';

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
