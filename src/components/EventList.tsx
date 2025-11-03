"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ToggleLeft, ToggleRight } from "lucide-react";
import { Event } from "@/store/api/eventsApi";

interface Props {
  events: Event[];
  onStatusChange?: () => void;
}

export default function EventList({ events, onStatusChange }: Props) {
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const toggleEventStatus = async (event: Event) => {
    if (!event?.sn) {
      console.error("Invalid event data:", event);
      alert("Invalid event data");
      return;
    }

    try {
      setLoadingEventId(event.sn);

      console.log("🔄 Making API call to make event live...");
      console.log("Event ID:", event.sn);
      console.log("Current status:", event.status);

      // Convert event.sn to number if it's a string
      const eventId =
        typeof event.sn === "string" ? parseInt(event.sn, 10) : event.sn;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event/makelive`,
        // "https://moloyal.com/mosave/script/api/event/makelive",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventid: eventId, // Use the converted number
          }),
        }
      );

      // console.log("📡 Response status:", response.status);
      // console.log("📡 Response ok:", response.ok);
      //
      const result = await response.json();
      console.log("📡 Full API response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      if (result.error === false) {
        // console.log("✅ Event status updated successfully!");
        // console.log("✅ Returned event ID:", result.eventid);

        // Call the callback to refresh events
        if (onStatusChange) {
          console.log("🔄 Calling onStatusChange to refresh events...");
          onStatusChange();
        } else {
          console.warn("⚠️ onStatusChange callback is not provided");
          alert(
            "Event status updated! Please refresh the page to see changes."
          );
        }
      } else {
        throw new Error(result.message || "API returned error");
      }
    } catch (error) {
      // More detailed error message
      let errorMessage = "Failed to update event status";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);

      // Log additional debug info
      console.log("🔍 Debug info:", {
        eventId: event.sn,
        eventIdType: typeof event.sn,
        currentStatus: event.status,
      });
    } finally {
      setLoadingEventId(null);
    }
  };

  // Sort events in descending order by date
  const sortedEvents = [...(events || [])].sort((a, b) => {
    try {
      const dateA = new Date(`${a.from_date}T${a.from_time}`).getTime();
      const dateB = new Date(`${b.from_date}T${b.from_time}`).getTime();
      return dateB - dateA;
    } catch (error) {
      console.error("Error sorting events:", error);
      return 0;
    }
  });

  // Count events by status
  const activeEvents =
    events?.filter((event) => event.status === "Active") || [];
  const inactiveEvents =
    events?.filter((event) => event.status !== "Active") || [];

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Status Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
        <h4 className="font-medium text-sm mb-2">Event Status Summary</h4>
        <div className="flex gap-4 text-xs">
          <span className="text-green-600 dark:text-green-400">
            Active: {activeEvents.length}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Inactive: {inactiveEvents.length}
          </span>
          <span className="text-blue-600 dark:text-blue-400">
            Total: {events?.length || 0}
          </span>
        </div>
      </div>

      {sortedEvents.map((event) => {
        const isLive = event.status === "Active";

        // Convert seat_capacity from string to number, handle NaN cases
        const seatCapacity = event.seat_capacity
          ? parseInt(event.seat_capacity, 10)
          : 0;
        const isValidSeatCapacity = !isNaN(seatCapacity) && seatCapacity > 0;

        const ticketsSold =
          event.ticketCategories?.reduce((acc, cat) => {
            return acc + parseInt(cat.quantity || "0", 10);
          }, 0) || 0;

        // Calculate progress percentage safely
        const progressPercentage = isValidSeatCapacity
          ? Math.min((ticketsSold / seatCapacity) * 100, 100)
          : 0;

        return (
          <div
            key={event.sn}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg truncate">{event.title}</h3>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span>
                    {new Date(
                      `${event.from_date}T${event.from_time}`
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>

                {/* Tickets Progress */}
                <div className="mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Tickets sold:{" "}
                  </span>
                  <span className="font-medium">
                    {ticketsSold}
                    {isValidSeatCapacity ? `/${seatCapacity}` : " (Unlimited)"}
                  </span>
                  {isValidSeatCapacity && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1 max-w-xs">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Debug Info */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-2 text-xs text-gray-400 space-x-2">
                    <span>
                      ID: {event.sn} ({typeof event.sn})
                    </span>
                    <span>Status: {event.status}</span>
                  </div>
                )}
              </div>

              {/* Live Toggle Button */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => toggleEventStatus(event)}
                  className="flex items-center gap-2 min-w-[120px] justify-center"
                  disabled={loadingEventId === event.sn}
                  size="sm"
                >
                  {loadingEventId === event.sn ? (
                    <>
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-sm">Updating...</span>
                    </>
                  ) : isLive ? (
                    <>
                      <ToggleRight className="h-5 w-5 text-green-500" />
                      <span className="text-green-600 font-medium">Live</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-500">Make Live</span>
                    </>
                  )}
                </Button>

                {/* Status indicator */}
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    isLive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isLive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {(!events || events.length === 0) && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>No events found</p>
        </div>
      )}
    </div>
  );
}
