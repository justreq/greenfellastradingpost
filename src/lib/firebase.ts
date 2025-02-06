import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCEUemp3rBZea5wnmTp8I-FdW_QhBDsOB4",
	authDomain: "greenfellas-trading-post.firebaseapp.com",
	projectId: "greenfellas-trading-post",
	storageBucket: "greenfellas-trading-post.firebasestorage.app",
	messagingSenderId: "220623560965",
	appId: "1:220623560965:web:195a365eac3d46c6d3d76c",
	measurementId: "G-20DE5JVTT2",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
