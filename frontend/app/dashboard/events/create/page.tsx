"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthSuspense from "@/components/auth/AuthSuspense";
import ToastManager from "@/components/toast/ToastManager";
import { createEvent } from "@/api/event";
import { uploadImage } from "@/api/uploadImage";
import EventForm from "../../events/_components/EventForm";

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try {
      let imageUrl = null;
      if (formData.pending_upload_img) {
        try {
          imageUrl = await uploadImage(formData.pending_upload_img);
        } catch (error) {
          console.error("Error uploading image:", error);
          ToastManager.addToast(
            "Failed to upload image. Please try again.",
            "error",
            3000,
          );
          throw error;
        }
      }

      await createEvent({
        ...formData,
        event_img: imageUrl,
      });

      ToastManager.addToast(
        formData.event_status === "published"
          ? "Event published successfully!"
          : "Event saved as draft!",
        "success",
        3000,
      );
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      ToastManager.addToast(
        "Failed to create event. Please try again.",
        "error",
        3000,
      );
      throw error;
    }
  };

  return (
    <AuthSuspense>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
          <EventForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/events")}
          />
        </div>
      </div>
    </AuthSuspense>
  );
}
