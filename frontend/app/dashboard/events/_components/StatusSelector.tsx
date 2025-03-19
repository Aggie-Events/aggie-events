import React from "react";
import { MdPublish } from "react-icons/md";
import { EventStatus } from "@/config/query-types";

interface StatusSelectorProps {
  status: EventStatus;
  onStatusChange: (status: EventStatus) => void;
}

export default function StatusSelector({ status, onStatusChange }: StatusSelectorProps) {
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <MdPublish className="inline mr-1" />
        Status
      </label>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as EventStatus)}
        className={`px-3 py-2 text-sm font-medium rounded-md border ${getStatusColor(status)}`}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
} 