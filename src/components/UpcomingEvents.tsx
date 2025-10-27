"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Event } from "@/store/api/eventsApi";
import EventModal from "./EventModal";
import {
  useGetUpcomingEventsQuery,
  useGetRecentPurchasesQuery,
} from "@/store/api/eventsApi";

export default function UpcomingEvents() {
  const { data, isLoading, isError } = useGetUpcomingEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // ✅ Fetch purchases only when an event is selected
  const { data: purchases, isLoading: isPurchasesLoading } =
    useGetRecentPurchasesQuery(selectedEvent?.sn ?? "", {
      skip: !selectedEvent, // ✅ Prevents fetching until an event is selected
    });

  if (isLoading) return <p>Loading events...</p>;
  if (isError) return <p>Failed to load events</p>;

  return (
    <>
      <Card className="bg-white dark:bg-gray-900 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="text-blue-500" size={20} />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.map((evt) => (
            <div
              key={evt.sn}
              onClick={() => setSelectedEvent(evt)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded flex justify-between items-start border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <p className="font-semibold">{evt.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {evt.venue}
                </p>
              </div>
              <p className="text-sm text-right text-gray-600 dark:text-gray-300">
                {new Date(evt.from_date).toDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
