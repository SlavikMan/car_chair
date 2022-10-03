
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, get, update, remove } = require ('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyDAahcmjx092Uv0jvZOGnnHdfay9q9yYjg",
  authDomain: "carseatshop.firebaseapp.com",
  databaseURL: "https://carseatshop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carseatshop",
  storageBucket: "carseatshop.appspot.com",
  messagingSenderId: "677899976858",
  appId: "1:677899976858:web:1717225ce9160272c81f23"
};

const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase(app));

async function getData(path) {
  return await get(child(dbRef, path)).then(data => data.exists() ? data.val() : '');
}
  
async function setData(updates) {
  return await update(dbRef, updates).then(() => true);
}

async function removeData(path) {
  const databaseRef = ref(getDatabase(app), path);
  return await remove(databaseRef).then(() => true);
}

module.exports = { getData, setData, removeData };