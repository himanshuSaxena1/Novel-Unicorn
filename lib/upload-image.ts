// lib/upload-image.ts
import axios from "axios";

export async function uploadImage(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? "");
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "Novel Unicorn"
  );

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const progress = Math.round((e.loaded * 100) / (e.total || 1));
        onProgress(progress);
      },
    });

    return response.data.secure_url;
  } catch (error: any) {
    const message =
      error.response?.data?.error?.message ||
      "Image upload failed. Please try again.";
    throw new Error(message);
  }
}
