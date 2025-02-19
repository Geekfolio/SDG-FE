"use client";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

interface Event {
  name: string;
  Creator: string;
  start: string;
  end: string;
  Contact: string | null;
  Eligible_Dept: string[];
  Description: string | null;
  Points: number | null;
  Link: string | null;
  Internal: boolean;
  Team_Size: number;
}

interface Feedback {
  event_name: string;
  student_mail: string;
  rating: number;
  review: string;
}

const EventFeedback: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch list of events on component mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Events:", data); // Added console log
        setEvents(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching events");
      });
  }, []);

  // Fetch feedback when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/feedback?event_name=${encodeURIComponent(selectedEvent)}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch feedbacks");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Feedbacks:", data); // Added console log
          setFeedbacks(data);
        })
        .catch((err) => {
          console.error(err);
          setError("Error fetching feedbacks");
        })
        .finally(() => setLoading(false));
    }
  }, [selectedEvent]);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(e.target.value);
    setFeedbacks([]);
  };

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`inline ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Feedback Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View student feedback for various events
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <label
              htmlFor="event-select"
              className="block text-sm font-medium black mb-2"
            >
              Select Event
            </label>
            <select
              id="event-select"
              value={selectedEvent}
              onChange={handleEventChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option key="default" value="">
                --Select an event--
              </option>
              {events.map((event) => (
                <option key={event.name} value={event.name}>
                  {event.name} ({formatDate(event.start)} -{" "}
                  {formatDate(event.end)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {selectedEvent && feedbacks.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No feedback
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No feedback available for this event.
                  </p>
                </div>
              ) : selectedEvent ? (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Feedback for {selectedEvent}
                  </h2>
                  <ul className="divide-y divide-gray-200">
                    {feedbacks.map((feedback, index) => (
                      <li key={index} className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-500">
                              {feedback.student_mail.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {feedback.student_mail}
                            </p>
                            <div className="mt-1">
                              {renderStars(feedback.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                ({feedback.rating}/5)
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>{feedback.review}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Select an event
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose an event from the dropdown to view feedback.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFeedback;
