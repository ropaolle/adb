import crypto from 'crypto';
import { database, firebaseAuth, DB_USERS } from './firebase';

const getPhotoURL = (user) => {
  const hash = crypto.createHash('md5').update(user.email).digest('hex');
  return (hash) ? `https://www.gravatar.com/avatar/${hash}` : '';
};

export const formatUserObj = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName || '',
    phoneNumber: user.phoneNumber || '',
    photoURL: user.photoURL || getPhotoURL(user),
  };
};

export function saveUser(user) {
  const newUser = formatUserObj(user);
  return database.collection(DB_USERS).doc(user.uid).set(newUser)
    .then(() => newUser);
}

export function auth(email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}
