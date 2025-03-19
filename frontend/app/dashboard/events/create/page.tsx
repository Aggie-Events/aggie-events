"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import AuthSuspense from "@/components/auth/AuthSuspense";
import { MdDescription, MdLocationOn } from "react-icons/md";
import ToastManager from "@/components/toast/ToastManager";
import { useRouter } from "next/navigation";
import { createEvent } from "@/api/event";
import { EventStatus } from "@/config/query-types";
import { CreateEventData } from "@/api/event";
import { toCST, dateToUTCMidnight } from "@/utils/date";
import { uploadImage } from "@/api/uploadImage";

// Import abstracted components
import TagSelector from "@/app/dashboard/events/_components/TagSelector";
import DateTimeSelector from "@/app/dashboard/events/_components/DateTimeSelector";
import StatusSelector from "@/app/dashboard/events/_components/StatusSelector";
import EventFormActions from "@/app/dashboard/events/_components/EventFormActions";
import ImageUploader from '@/app/dashboard/events/_components/ImageUploader';

export interface EventForm {
  event_name: string;
  event_description: string;
  event_location: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status: EventStatus;
  tags: string[];
  img: File | null;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventForm>({
    event_name: "",
    event_description: "",
    event_location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    status: "draft",
    tags: [],
    img: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // First, upload the image if one exists
      let imageUrl = null;
      if (formData.img) {
        try {
          imageUrl = await uploadImage(formData.img);
        } catch (error) {
          console.error("Error uploading image:", error);
          ToastManager.addToast(
            "Failed to upload image. Please try again.",
            "error",
            3000
          );
          setIsSubmitting(false);
          return;
        }
      }

      const eventData: CreateEventData = {
        event_name: formData.event_name,
        event_description: formData.event_description || null,
        event_location: formData.event_location || null,
        start_time: isAllDay 
          ? dateToUTCMidnight(formData.start_date)
          : toCST(formData.start_date, formData.start_time),
        end_time: isAllDay 
          ? dateToUTCMidnight(formData.end_date)
          : toCST(formData.end_date, formData.end_time),
        event_status: formData.status,
        tags: formData.tags,
        event_img: imageUrl
      };

      await createEvent(eventData);
      
      ToastManager.addToast(
        formData.status === 'published' 
          ? "Event published successfully!" 
          : "Event saved as draft!",
        "success",
        3000
      );
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      ToastManager.addToast(
        "Failed to create event. Please try again.",
        "error",
        3000,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSuspense>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Image
              </label>
              <ImageUploader
                value={formData.img}
                onImageChange={(file) => setFormData({ ...formData, img: file })}
              />
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={formData.event_name}
                onChange={(e) =>
                  setFormData({ ...formData, event_name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter event name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MdDescription className="inline mr-1" />
                Description
              </label>
              <textarea
                value={formData.event_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event_description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Describe your event"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MdLocationOn className="inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.event_location}
                onChange={(e) =>
                  setFormData({ ...formData, event_location: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter event location"
              />
            </div>

            {/* Date and Time */}
            <DateTimeSelector 
              startDate={formData.start_date}
              startTime={formData.start_time}
              endDate={formData.end_date}
              endTime={formData.end_time}
              isAllDay={isAllDay}
              onStartDateChange={(date) => setFormData({ ...formData, start_date: date })}
              onStartTimeChange={(time) => setFormData({ ...formData, start_time: time })}
              onEndDateChange={(date) => setFormData({ ...formData, end_date: date })}
              onEndTimeChange={(time) => setFormData({ ...formData, end_time: time })}
              onAllDayChange={setIsAllDay}
            />

            {/* Status */}
            <StatusSelector 
              status={formData.status}
              onStatusChange={(status) => setFormData({ ...formData, status })}
            />

            {/* Tags */}
            <TagSelector 
              selectedTags={formData.tags}
              onTagsChange={(tags) => setFormData({ ...formData, tags })}
            />

            {/* Submit Buttons */}
            <EventFormActions 
              status={formData.status}
              isSubmitting={isSubmitting}
              onCancel={() => router.push("/dashboard/events")}
            />
          </form>
        </div>
      </div>
    </AuthSuspense>
  );
}
