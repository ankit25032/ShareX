import {initializeApp} from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAw01qHrB6Zubb_0t6DbI6CV9IzXMBEov8",
    authDomain: "sharex-ca8a4.firebaseapp.com",
    databaseURL: "https://sharex-ca8a4-default-rtdb.firebaseio.com",
    projectId: "sharex-ca8a4",
    storageBucket: "sharex-ca8a4.appspot.com",
    messagingSenderId: "576843458257",
    appId: "1:576843458257:web:9a9e2e293a1341f2e747f0"
  };


  const firebaseApp = initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage(firebaseApp,"gs://sharex-ca8a4.appspot.com");
  export default storage;
