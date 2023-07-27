import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNAyf5WkIDShSKFtQ1u-KjnolbQcT96Ho",
  authDomain: "e-commerce-images-52905.firebaseapp.com",
  projectId: "e-commerce-images-52905",
  storageBucket: "e-commerce-images-52905.appspot.com",
  messagingSenderId: "517910904608",
  appId: "1:517910904608:web:577bf3e8d049f396fee145",
  measurementId: "G-20WMGQ591V"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();

module.exports = {
    getStorage, ref, uploadBytesResumable, getDownloadURL
}