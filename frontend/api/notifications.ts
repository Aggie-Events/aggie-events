import type { NotificationProps } from "@/app/(other)/notifications/_components/NotificationCard";

// Type without the handlers
export type Notification = Omit<NotificationProps, "onMarkAsRead" | "onDelete">;

// Mock data for development
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "event",
    title: "Event Updated",
    message: "The event 'Spring Picnic' has been updated with a new location.",
    timestamp: "2023-04-06T14:30:00Z",
    isRead: false,
    sourceId: 123,
    sourceName: "Spring Picnic"
  },
  {
    id: "2",
    type: "organization",
    title: "New Announcement",
    message: "The Computer Science Student Association has posted a new announcement.",
    timestamp: "2023-04-05T10:15:00Z",
    isRead: true,
    sourceId: 456,
    sourceName: "Computer Science Student Association"
  },
  {
    id: "3",
    type: "event",
    title: "Event Reminder",
    message: "Don't forget about the 'Career Fair' tomorrow!",
    timestamp: "2023-04-04T18:45:00Z",
    isRead: false,
    sourceId: 789,
    sourceName: "Career Fair"
  },
  {
    id: "4",
    type: "organization",
    title: "New Event Added",
    message: "The Engineering Club has added a new event: 'Engineering Expo'.",
    timestamp: "2023-04-03T09:20:00Z",
    isRead: false,
    sourceId: 101,
    sourceName: "Engineering Club"
  }
];

// The actual service
const NotificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (): Promise<Notification[]> => {
    // In a real implementation, this would call your backend API
    // const response = await fetch('/api/notifications');
    // return response.json();
    
    // For now, return mock data with a delay to simulate network
    return new Promise(resolve => {
      setTimeout(() => resolve(mockNotifications), 500);
    });
  },
  
  /**
   * Mark a notification as read
   */
  markAsRead: async (id: string): Promise<boolean> => {
    // In a real implementation, this would call your backend API
    // const response = await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    // return response.ok;
    
    // For now, return success after a delay
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 300);
    });
  },
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<boolean> => {
    // In a real implementation, this would call your backend API
    // const response = await fetch('/api/notifications/read-all', { method: 'PUT' });
    // return response.ok;
    
    // For now, return success after a delay
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 300);
    });
  },
  
  /**
   * Delete a notification
   */
  deleteNotification: async (id: string): Promise<boolean> => {
    // In a real implementation, this would call your backend API
    // const response = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    // return response.ok;
    
    // For now, return success after a delay
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 300);
    });
  },
};

export default NotificationService; 