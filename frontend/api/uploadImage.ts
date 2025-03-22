import { fetchUtil } from "@/api/fetch";

export async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file); // "image" must match backend's `upload.single("image")`

    // Use direct fetch for file upload instead of fetchUtil
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      {
        method: "POST",
        credentials: "include", // Important: needed for auth
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.url; // Returns Cloudinary URL
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Image upload failed: " + error);
  }
}