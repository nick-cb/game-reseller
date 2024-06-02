import * as admin from "firebase-admin";
import { AppOptions } from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "@/game-reseller-firebase-adminsdk-uo65f-8d096820e0.json";

const firebaseConfig: AppOptions = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://web-shop-ban-game-next-13.appspot.com/",
};

const app =
  admin.apps.length === 0 ? admin.initializeApp(firebaseConfig) : admin.apps[0]!;

const storage = getStorage(app);

export const bucket = storage.bucket();
