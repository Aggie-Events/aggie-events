"use client";
import { useParams, useRouter } from "next/navigation";
import { useEvent, useEventMutation } from "@/api/event";
import { useAuth } from "@/components/auth/AuthContext";
import AuthSuspense from "@/components/auth/AuthSuspense";
import ToastManager from "@/components/toast/ToastManager";
import { formatDateForInput, formatTimeForInput } from "@/utils/date";
import EventForm, { EventFormData } from "../../_components/EventForm";
import { uploadImage } from "@/api/uploadImage";

export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isPending, isError } = useEvent(eventId);
  const { mutate: mutateEvent, isPending: isUpdating } =
    useEventMutation(eventId);

  return (
    <AuthSuspense>
      <div className="min-h-screen bg-gray-50">
        {isPending || (isUpdating && <Loading />)}
        {isError && <EditError />}
        {event && <EditForm event={event} mutateEvent={mutateEvent} />}
      </div>
    </AuthSuspense>
  );
}

function EditForm({
  event,
  mutateEvent,
}: {
  event: any;
  mutateEvent: (eventData: EventFormData) => void;
}) {
  const router = useRouter();

  // Convert dates to local format for form inputs
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const initialData: EventFormData = {
    event_name: event.event_name,
    event_description: event.event_description || "",
    event_location: event.event_location || "",
    start_date: formatDateForInput(startDate),
    start_time: formatTimeForInput(startDate),
    end_date: formatDateForInput(endDate),
    end_time: formatTimeForInput(endDate),
    event_status: event.event_status || "draft",
    tags: event.tags || [],
    pending_upload_img: null,
    event_img: event.event_img,
  };

  const handleSubmit = async (formData: any) => {
    try {
      let imageUrl = event.event_img;
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

      await mutateEvent({
        ...formData,
        event_img: imageUrl,
      });

      ToastManager.addToast("Event updated successfully!", "success", 3000);

      router.push("/dashboard/events");
    } catch (error) {
      console.error("Error updating event:", error);
      ToastManager.addToast(
        "Failed to update event. Please try again.",
        "error",
        3000,
      );
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        <EventForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/dashboard/events")}
          isEditing={true}
        />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-2xl">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function EditError() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-maroon mb-4">
        Unable to Edit Event
      </h1>
      <p className="text-gray-600 mb-8">
        The event you're trying to edit doesn't exist or you don't have
        permission to edit it.
      </p>
      <button
        onClick={() => router.push("/dashboard/events")}
        className="px-6 py-3 bg-maroon text-white rounded-full hover:bg-darkmaroon transition-colors"
      >
        Return to Events
      </button>
    </div>
  );
}
