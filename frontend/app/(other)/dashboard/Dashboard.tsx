"use client";
import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import { useAuth } from "@/components/auth/AuthContext";
import { addUser, deleteUser } from "@/api/user";
import { testAuth } from "@/api/auth";
import { Event } from "@/config/dbtypes";
import { EventCreate } from "@/config/query-types";
import IconLabel from "@/app/(other)/search/components/IconLabel";
import { FaLocationDot } from "react-icons/fa6";
import { createEvent } from "@/api/event";
import ToastManager from "@/components/toast/ToastManager";
import { DatePicker } from '@react-spectrum/datepicker';
import { TimeField, Flex, Provider, defaultTheme, lightTheme, darkTheme} from '@adobe/react-spectrum';
import { CalendarDate, Time} from '@internationalized/date';
import { start } from "repl";
export default function Dashboard() {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const options = ["Users", "Events", "Organizations"];
  return (
    <div className="flex grow justify-center mt-5 h-full">
      <div className="max-w-[1000px] w-full">
        <ul className="flex gap-2">
          {options.map((option, i) => (
            <li
              className={
                "px-3 py-1 rounded-t-lg " +
                (page === i && "bg-maroon-500 text-white")
              }
              key={i}
            >
              <button onClick={() => setPage(i)}>{option}</button>
            </li>
          ))}
        </ul>
        <div className="p-2 bg-gray-200 rounded-b-lg">
          {user && (
            <h1 className="text-xl font-bold">Welcome, {user.user_name}!</h1>
          )}
          {page === 0 && <UserForm />}
          {page === 1 && <EventForm />}
        </div>
      </div>
    </div>
  );
}

function UserForm() {
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);
  return (
    <>
      <div className="my-2">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
        />
        <button
          onClick={() => {
            addUser(username!, email!);
            setUpdate(!update);
          }}
          className="bg-blue-500 rounded-md px-2 py-1"
        >
          Create user
        </button>
      </div>
      <div className="my-2">
        <button
          className="bg-red-400 rounded-md px-2 py-1"
          onClick={() => {
            deleteUser();
            setUpdate(!update);
          }}
        >
          Delete users
        </button>
      </div>
      <div className="mx-3 w-2/5">
        <UserList update={update} />
      </div>
    </>
  );
}

function EventForm() {
  const today = new Date(); // Get the current date
const currentCalendarDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()); 
const MaxCalendarDate = new CalendarDate(today.getFullYear()+1, today.getMonth() + 1, today.getDate()); 
  const [eventName, setEventName] = useState<string>();
  const [eventDescription, setEventDescription] = useState<string>();
  const [eventLocation, setEventLocation] = useState<string>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();
  const [tags, setTags] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(currentCalendarDate);
  const [selectedDateEnd, setSelectedDateEnd] = useState<CalendarDate | null>(currentCalendarDate);
  const [selectedTime, setSelectedTime] = useState<Time | null>(new Time(12, 0, 0)); // Default to 12:00 PM
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<Time | null>(new Time(12, 0, 0));

  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDate(date); 
    console.log(date)
    startTimechange();
  // Update selectedDate
  };
  const startTimechange = () =>{
    if (selectedTime && selectedDate) {
      const dateObj = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day); // CalendarDate uses 1-based month

      // Get hours and minutes from the selectedTime object
      const { hour, minute } = selectedTime;
  
      // Set the selected time on the date object
      dateObj.setHours(hour, minute, 0, 0); // Setting hours, minutes, and zeroing out seconds & milliseconds
  
      // Format the date and time into "YYYY-MM-DD HH:mm:ss+00"
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hourFormatted = String(dateObj.getHours()).padStart(2, '0');
      const minuteFormatted = String(dateObj.getMinutes()).padStart(2, '0');
      
      const starttime = `${year}-${month}-${day} ${hourFormatted}:${minuteFormatted}:00+00`;
      console.log(starttime)
     setStartTime(starttime)
    }
  }
  useEffect(() => {
    if (selectedDate) {
      startTimechange(); // Call startTimechange only after selectedDate is updated
    }
    if (selectedTime) {
      startTimechange(); // Call startTimechange only after selectedDate is updated
    }
  }, [selectedDate, selectedTime]); 
  const handleDateChangeEnd = (date: CalendarDate | null) => {
    setSelectedDateEnd(date); 
    console.log(date)
    startTimechangeEnd();
  // Update selectedDate
  };
  const startTimechangeEnd = () =>{
    if (selectedTimeEnd && selectedDateEnd) {
      const dateObj = new Date(selectedDateEnd.year, selectedDateEnd.month - 1, selectedDateEnd.day); // CalendarDate uses 1-based month

      // Get hours and minutes from the selectedTime object
      const { hour, minute } = selectedTimeEnd;
  
      // Set the selected time on the date object
      dateObj.setHours(hour, minute, 0, 0); // Setting hours, minutes, and zeroing out seconds & milliseconds
  
      // Format the date and time into "YYYY-MM-DD HH:mm:ss+00"
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hourFormatted = String(dateObj.getHours()).padStart(2, '0');
      const minuteFormatted = String(dateObj.getMinutes()).padStart(2, '0');
      const starttime = `${year}-${month}-${day} ${hourFormatted}:${minuteFormatted}:00+00`;
      setEndTime(starttime)
      console.log(starttime)
    }
  }
  useEffect(() => {
    if (selectedDateEnd) {
      startTimechangeEnd(); // Call startTimechange only after selectedDate is updated
    }
    if (selectedTimeEnd) {
      startTimechangeEnd(); // Call startTimechange only after selectedDate is updated
    }
  }, [selectedDateEnd, selectedTimeEnd]); 
  const customTheme = {
    ...defaultTheme,
    global: {
      backgroundColor: "#ffffff", // White background
      textColor: "#ffffff", // Dark text
      borderColor: "#ccc", // Light gray border
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "8px", // Optional: Rounded corners
    },
  };
  const addEvent = async () => {
    const event: EventCreate = {
      event_name: eventName!,
      event_description: eventDescription?.trim() || null,
      event_location: eventLocation?.trim() || null,
      start_time: new Date(startTime!),
      end_time: new Date(endTime!),
      tags: tags?.split(",").map((tag) => tag.trim()) || [],
    };
    console.log(event as EventCreate);
    createEvent(event)
      .then((res) => {
        ToastManager.addToast("Event created successfully", "success");
        console.log(res);
      })
      .catch((err) => {
        ToastManager.addToast("Error creating event", "error");
        console.log(err);
      });
  };

  return (
    <>
      <div className="my-2">
        <div className="flex flex-col w-[700px] gap-1">
          <input
            type="text"
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
            className="border border-gray-300 bg-gray-100 p-1 rounded mr-2 text-lg"
          />
          <div className="flex gap-2 items-center">
          <Provider theme={customTheme}>
      <Flex gap="size-200" direction="column">
        <TimeField label="Pick a start time" value={selectedTime} onChange={setSelectedTime} />
      </Flex>
    </Provider>
            <Provider theme={customTheme}>
      <DatePicker
        label="Pick a start date"
        value={selectedDate} // Must be a CalendarDate, not a Date object
        minValue={currentCalendarDate}
        maxValue={MaxCalendarDate}
        onChange={handleDateChange}
      />
    </Provider>
    
    
            <div>to</div>
          
            {/* <input
              type="text"
              placeholder="Enter end time"
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 bg-gray-100 p-1 rounded"
            /> */}
            <Provider theme={customTheme}>
      <Flex gap="size-200" direction="column">
        <TimeField label="Pick a start time" value={selectedTimeEnd} onChange={setSelectedTimeEnd} />
      </Flex>
    </Provider>
            <Provider theme={customTheme}>
      <DatePicker
        label="Pick a end date"
        value={selectedDateEnd} // Must be a CalendarDate, not a Date object
        minValue={currentCalendarDate}
        maxValue={MaxCalendarDate}
        onChange={handleDateChangeEnd}
      />
    </Provider>
          </div>

          <div className="flex items-center gap-1 text-md mt-5">
            <FaLocationDot color="maroon" />
            <input
              type="text"
              placeholder="Add location..."
              onChange={(e) => setEventLocation(e.target.value)}
              className="border border-gray-300 bg-gray-100 p-1 rounded mr-2"
            />
          </div>
          <textarea
            placeholder="Add description..."
            onChange={(e) => setEventDescription(e.target.value)}
            className="border border-gray-300 bg-gray-100 p-1 rounded basis-32"
          />
          <textarea
            placeholder="Add tags (comma seperated)..."
            onChange={(e) => setTags(e.target.value)}
            className="border border-gray-300 bg-gray-100 p-1 rounded basis-32"
          />
          <button
            onClick={() => {
              addEvent();
            }}
            className="bg-maroon-500 text-white rounded-md px-2 py-1"
          >
            Create Event
          </button>
        </div>
      </div>
      <div className="mx-3 w-2/5">{/*<UserList update={update} />*/}</div>
    </>
  );
}
