import axios from "axios";
import { API_URL } from "../Constants/ApiConstant";

export const uploadFile = async (imageUpload) => {
    if (!imageUpload) return;
    const form = new FormData();
    form.append("file", imageUpload);

    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_URL}/upload`, form, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        timeout: 60_000,
    });

    return res.data?.data?.url;
};

export const uploadMultiFile = async (imagesUpload) => {
    if (!imagesUpload) return;
    const listImages = [];
    for (let i = 0; i < imagesUpload.length; i++) {
        const url = await uploadFile(imagesUpload[i]);
        if (url) listImages.push(url);
    }
    return listImages;
};

export const deleteFile = async (imageUpload) => {
    if (!imageUpload) return;
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`${API_URL}/upload`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
            },
            data: { url: imageUpload },
            timeout: 30_000,
        });
    } catch (e) {
        // best-effort delete; don't break UI if cleanup fails
        console.warn("Delete file failed", e?.message || e);
    }
};