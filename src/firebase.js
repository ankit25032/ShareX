import {initializeApp} from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain:`${process.env.REACT_APP_AUTH_DOMAIN }` ,
    databaseURL: `${process.env.REACT_APP_DATABASE_URL}`,
    projectId: "sharex-ca8a4",
    storageBucket: `${process.env.REACT_APP_BUCKET_ID}`,
    messagingSenderId: "576843458257",
    appId: "1:576843458257:web:9a9e2e293a1341f2e747f0"
  };


  const firebaseApp = initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage(firebaseApp,"gs://sharex-ca8a4.appspot.com");
  export default storage;
