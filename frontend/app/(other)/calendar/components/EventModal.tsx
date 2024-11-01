// components/EventModal.tsx
import React, { useState } from 'react';

interface EventModalProps {
  selectedDate: Date;
  onClose: () => void;
  onSave: (event: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ selectedDate, onClose, onSave }) => {
  const [event, setEvent] = useState<string>('');

  const handleSubmit = (): void => {
    if (event.trim()) {
      onSave(event);
    }
    setEvent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Add Event on {selectedDate.toDateString()}</h2>
        <input
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          placeholder="Event name"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
