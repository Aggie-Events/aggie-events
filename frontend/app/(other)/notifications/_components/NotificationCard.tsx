"use client";

import React from "react";
import { MdEvent, MdGroup, MdDateRange, MdCheck, MdDelete } from "react-icons/md";

export interface NotificationProps {
  id: string;
  type: "event" | "organization";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sourceId: number;
  sourceName: string;
  sourceImage?: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({
  id,
  type,
  title,
  message,
  timestamp,
  isRead,
  sourceId,
  sourceName,
  sourceImage,
  onMarkAsRead,
  onDelete
}: NotificationProps) {
  
  // Format timestamp to a readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <div 
      className={`p-4 rounded-lg border flex items-start ${
        isRead ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <div className="p-2 rounded-full mr-3 mt-1">
        {type === "event" ? (
          <MdEvent className="text-maroon" size={24} />
        ) : (
          <MdGroup className="text-maroon" size={24} />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">
            {title}
            {!isRead && (
              <span className="ml-2 inline-block w-2 h-2 bg-maroon rounded-full"></span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MdDateRange size={14} />
              {formatDate(timestamp)}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mt-1">{message}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium text-maroon">
            {sourceName}
          </span>
          <div className="flex gap-2">
            {!isRead && (
              <button 
                onClick={() => onMarkAsRead(id)}
                className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <MdCheck size={16} /> Mark as read
              </button>
            )}
            <button 
              onClick={() => onDelete(id)}
              className="text-sm flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <MdDelete size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 