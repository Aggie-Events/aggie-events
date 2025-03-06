export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file); // "image" must match backend's `upload.single("image")`
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error("Image upload failed");
    }
  
    const data = await res.json();
    return data.url; // Returns Cloudinary URL
  };