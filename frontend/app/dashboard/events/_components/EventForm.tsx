"use client";
import { useState, useEffect } from "react";
import { MdDescription, MdLocationOn } from "react-icons/md";
import { EventStatus } from "@/config/query-types";
import { toCST, dateToUTCMidnight } from "@/utils/date";
import { uploadImage } from "@/api/uploadImage";

// Import abstracted components
import TagSelector from "./TagSelector";
import DateTimeSelector from "./DateTimeSelector";
import StatusSelector from "./StatusSelector";
import EventFormActions from "./EventFormActions";
import ImageUploader from './ImageUploader';

export interface EventFormData {
  event_name: string;
  event_description: string;
  event_location: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  event_status: EventStatus;
  tags: string[];
  pending_upload_img: File | null; // File for the pending uploaded image
  event_img?: string | null; // URL of the current image (if any)
}

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: {
    event_name: string;
    event_description: string;
    event_location: string;
    start_time: string;
    end_time: string;
    event_status: EventStatus;
    tags: string[];
    pending_upload_img: File | null;
    event_img?: string | null;
  }) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function EventForm({ initialData, onSubmit, onCancel, isEditing = false }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    event_name: "",
    event_description: "",
    event_location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    event_status: "draft",
    tags: [],
    pending_upload_img: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Check if it's an all-day event
      if (initialData.start_time === "00:00" && initialData.end_time === "00:00") {
        setIsAllDay(true);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const startTime = isAllDay 
        ? dateToUTCMidnight(formData.start_date).toISOString()
        : toCST(formData.start_date, formData.start_time).toISOString();
      
      const endTime = isAllDay 
        ? dateToUTCMidnight(formData.end_date).toISOString()
        : toCST(formData.end_date, formData.end_time).toISOString();

      await onSubmit({
        event_name: formData.event_name,
        event_description: formData.event_description,
        event_location: formData.event_location,
        start_time: startTime,
        end_time: endTime,
        event_status: formData.event_status,
        tags: formData.tags,
        pending_upload_img: formData.pending_upload_img,
        event_img: formData.event_img
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Image
        </label>
        <ImageUploader
          value={formData.pending_upload_img}
          onImageChange={(file) => setFormData({ ...formData, pending_upload_img: file })}
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
        status={formData.event_status}
        onStatusChange={(status) => setFormData({ ...formData, event_status: status })}
      />

      {/* Tags */}
      <TagSelector 
        selectedTags={formData.tags}
        onTagsChange={(tags) => setFormData({ ...formData, tags })}
      />

      {/* Submit Buttons */}
      <EventFormActions 
        status={formData.event_status}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        isEditing={isEditing}
      />
    </form>
  );
} 