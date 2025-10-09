// lib/upload-image.ts
import axios from "axios";

export async function uploadImage(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "api_key",
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "762695328814141"
  );
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"
  );

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dp09hey5j";
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: false,
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded * 100) / (event.total || 1));
        onProgress(progress);
      },
    });

    return response.data.secure_url;
  } catch (error: any) {
    const message =
      error.response?.data?.error?.message ||
      "Image upload failed. Please try another image.";
    throw new Error(message);
  }
}
