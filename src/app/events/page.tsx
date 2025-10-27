"use client";

import Layout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import EventList from "@/components/EventList";
import CreateEventButton from "@/components/CreateEventButton";
import {
  useGetAllEventsQuery,
  // useUpdateEventStatusMutation,
  Event,
} from "@/store/api/eventsApi";

export default function EventsPage() {
  // ✅ Fetch events from API
  const { data, isLoading, isError, refetch } = useGetAllEventsQuery();
  const events: Event[] = data?.data || [];

  const totalEvents = events.length;
  const liveEventsCount = events.filter(
    (event) => event.status === "Active"
  ).length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.from_date) > new Date()
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Events</h1>
          <CreateEventButton />
        </div>

        {/* Event Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Total Events
            </h3>
            <p className="text-2xl font-bold">{totalEvents}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Live Events
            </h3>
            <p className="text-2xl font-bold">{liveEventsCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              Upcoming Events
            </h3>
            <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
          </div>

          {isLoading ? (
            <p className="p-4 text-gray-500">Loading events...</p>
          ) : isError ? (
            <p className="p-4 text-red-500">Failed to fetch events</p>
          ) : events.length === 0 ? (
            <p className="p-4 text-gray-500">No events found</p>
          ) : (
            <EventList
              events={events}
              // onStatusChange={refetch}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
