"use client";

import React, { useState, useEffect } from "react";
import { MdNotifications, MdEvent, MdGroup, MdCheck } from "react-icons/md";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NotificationCard from "./_components/NotificationCard";
import NotificationService, { Notification } from "@/api/notifications";

// Define notification type 
type NotificationType = "event" | "organization";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationType | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await NotificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const success = await NotificationService.markAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const success = await NotificationService.deleteNotification(id);
      if (success) {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== id)
        );
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const success = await NotificationService.markAllAsRead();
      if (success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MdNotifications className="text-maroon" />
          Notifications
        </h1>
        
        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-maroon text-white rounded-md hover:bg-maroon/90 transition-colors"
          >
            <MdCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button 
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === "all" 
              ? "border-maroon text-maroon" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab("event")}
          className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-1 ${
            activeTab === "event" 
              ? "border-maroon text-maroon" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MdEvent size={16} />
          Events
        </button>
        <button 
          onClick={() => setActiveTab("organization")}
          className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-1 ${
            activeTab === "organization" 
              ? "border-maroon text-maroon" 
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MdGroup size={16} />
          Organizations
        </button>
      </div>

      {/* Notifications Count */}
      <div className="mb-4 text-sm text-gray-500">
        {!isLoading && (
          <p>
            Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            {activeTab !== 'all' && ` for ${activeTab}s`}
          </p>
        )}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              {...notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
} 