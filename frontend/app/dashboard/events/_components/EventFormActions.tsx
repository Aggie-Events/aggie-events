import React from "react";
import { MdAdd, MdPublish } from "react-icons/md";
import { EventStatus } from "@/config/query-types";

interface EventFormActionsProps {
  status: EventStatus;
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function EventFormActions({ 
  status, 
  isSubmitting, 
  onCancel, 
  isEditing 
}: EventFormActionsProps) {
  return (
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
          <>
            {status === 'published' ? <MdPublish size={20} /> : <MdAdd size={20} />}
            {status === 'published' ? 'Publish Event' : 'Save as Draft'}
          </>
        )}
      </button>
    </div>
  );
} 