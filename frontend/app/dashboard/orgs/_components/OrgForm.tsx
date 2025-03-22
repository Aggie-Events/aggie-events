import { useState } from "react";
import { Organization } from "@/config/dbtypes";

interface OrgFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Organization>;
}

export default function OrgForm({ onSubmit, onCancel, initialData }: OrgFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Organization>({
    org_name: initialData?.org_name || "",
    org_email: initialData?.org_email || "",
    org_description: initialData?.org_description || "",
    org_icon: initialData?.org_icon || "",
    org_verified: initialData?.org_verified || false,
    org_reputation: initialData?.org_reputation || 0,
    org_building: initialData?.org_building || "",
    org_room: initialData?.org_room || "",
  });

  const [pendingUploadImg, setPendingUploadImg] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        pending_upload_img: pendingUploadImg,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Organization Name */}
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

      {/* Organization Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organization Email *
        </label>
        <input
          type="email"
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

      {/* Organization Icon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organization Icon *
        </label>
        <input
          type="file"
          required={!formData.org_icon}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPendingUploadImg(file);
            }
          }}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Organization Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organization Location *
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

      {/* Room Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Number *
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
          onClick={onCancel}
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
            "Create Organization"
          )}
        </button>
      </div>
    </form>
  );
} 