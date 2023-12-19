import { storage } from "./config.js";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage";
import { v4 } from "uuid";

export const uploadFile = async (imageUpload) => {
    console.log(imageUpload);
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload)
    const url = await getDownloadURL(snapshot.ref);
    return url;
};

export const uploadMultiFile = async (imagesUpload) => {
    if (imagesUpload == null) return;
    let listImages = [];
    for(var i = 0; i < imagesUpload.length; i++) {
        const imageRef = ref(storage, `images/${imagesUpload[i].name + v4()}`);
        const snapshot = await uploadBytes(imageRef, imagesUpload[i]);
        const url = await getDownloadURL(snapshot.ref);
        listImages.push(url);
    }
    return listImages;
};

export const deleteFile = async (imageUpload) => {
    const imageRef = ref(storage,imageUpload);
    deleteObject(imageRef);
};