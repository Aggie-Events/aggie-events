"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import AuthSuspense from "@/components/auth/AuthSuspense";
import {
  MdLocationOn,
  MdAccessTime,
  MdDescription,
  MdClose,
  MdAdd,
} from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { fetchTags } from "@/api/tags";
import ToastManager from "@/components/toast/ToastManager";
import { useRouter } from "next/navigation";

interface EventForm {
  event_name: string;
  event_description: string;
  event_location: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  tags: string[];
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<EventForm>({
    event_name: "",
    event_description: "",
    event_location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tagInput.length > 0) {
      fetchTags(tagInput).then((tags) => {
        setTagSuggestions(
          tags
            .map((tag: { tag_name: string }) => tag.tag_name)
            .filter((tag: string) => !formData.tags.includes(tag)),
        );
      });
    } else {
      setTagSuggestions([]);
    }
  }, [tagInput, formData.tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    if (focused) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [focused]);

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
    }
    setTagInput("");
    setFocused(false);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const combinedData = {
        ...formData,
        start_time: `${formData.start_date}T${formData.start_time}`,
        end_time: `${formData.end_date}T${formData.end_time}`,
      };

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      ToastManager.addToast("Event created successfully!", "success", 3000);
      router.push("/"); // Redirect to home page after success
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
            <div className="space-y-4">
              {/* Start Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdAccessTime className="inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdAccessTime className="inline mr-1" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdAccessTime className="inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdAccessTime className="inline mr-1" />
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Tags Input with Autocomplete */}
            <div ref={tagRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaTag className="inline mr-1" />
                Tags
              </label>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/80"
                    >
                      <MdClose size={16} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Tag Input */}
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onFocus={() => setFocused(true)}
                  placeholder="Add tags..."
                  className="w-full px-3 py-2 border rounded-md"
                />

                {/* Tag Suggestions */}
                {focused && tagSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg">
                    {tagSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                      >
                        <FaTag className="text-primary" size={12} />
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 justify-end mt-8 border-t pt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                onClick={() =>
                  window.history.length > 1
                    ? window.history.back()
                    : (window.location.href = "/")
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-primary/90 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MdAdd size={20} />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthSuspense>
  );
}
