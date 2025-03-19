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
  MdPublish,
  MdSchedule,
} from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { useTagAutocomplete } from "@/api/tags";
import ToastManager from "@/components/toast/ToastManager";
import { useRouter } from "next/navigation";
import { createOrg } from "@/api/orgs";
import { EventStatus } from "@/config/query-types";
import { CreateOrgData } from "@/api/orgs";
import { toCST, dateToUTCMidnight } from "@/utils/date";
import { useDropzone } from "react-dropzone";
import { fetchUtil } from "@/api/fetch";
import { uploadImage } from "@/api/uploadImage";

export interface Organization {
  org_name: string;
  org_email: string | null;
  org_description: string;
  org_icon: string;
  org_verified: boolean;
  org_reputation: number;
  org_building: string | null;
  org_room: string | null;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Organization>({
    org_name: "",
    org_email: "",
    org_description: "",
    org_icon: "",
    org_verified: false,
    org_reputation: 0,
    org_building: "",
    org_room: "",
  });

  const [tagInput, setTagInput] = useState("");
  const { data: tagSuggestions = [] } = useTagAutocomplete(tagInput);
  const [focused, setFocused] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);

  // Close the tag suggestions when the user clicks outside of the tag input
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const eventData: CreateOrgData = {
        org_name: formData.org_name,
        org_email: formData.org_email,
        org_description: formData.org_description,
        org_icon: formData.org_icon,
        org_verified: false,
        org_reputation: 0,
        org_building: formData.org_building,
        org_room: formData.org_room,
      };

      await createOrg(eventData);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AuthSuspense>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Organization</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                required
                value={formData.org_name}
                onChange={(e) =>
                  setFormData({ ...formData, org_name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Email *
              </label>
              <input
                type="text"
                required
                value={formData.org_email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, org_email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter organization email"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.org_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    org_description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Describe your organization"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization icon *
              </label>
              <input
                type="file"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];  // Optional chaining to check for null
                  if (file) {
                    uploadImage(file).then((url) => {
                      setFormData({ ...formData, org_icon: url });  // Save the URL returned from the upload function
                    });
                  } else {
                    console.log("No file selected");
                  }
                }}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter organization icon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization location *
              </label>
              <input
                type="text"
                required
                value={formData.org_building || ""}
                onChange={(e) =>
                  setFormData({ ...formData, org_building: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter organization location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room number*
              </label>
              <input
                type="text"
                required
                value={formData.org_room || ""}
                onChange={(e) =>
                  setFormData({ ...formData, org_room: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter room number"
              />
            </div>
            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end mt-8 border-t pt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
                onClick={() => router.push("/dashboard/events")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-maroon text-white px-6 py-2 rounded-md hover:bg-darkmaroon transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {/* Add submit text if not submitting */}
                    Create Organization
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
