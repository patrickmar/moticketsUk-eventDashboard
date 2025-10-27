"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Event, useGetAllEventsQuery } from "@/store/api/eventsApi";

type FilterOption = "All Time" | "Last 30 Days" | "Last 7 Days";

export default function TicketsSoldPerEvent() {
  const [filter, setFilter] = useState<FilterOption>("Last 30 Days");

  // ✅ Fetch all events
  const { data, isLoading, isError } = useGetAllEventsQuery();
  const events: Event[] = data?.data || [];

  // ✅ Filter events based on selected range
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    const now = new Date();
    let cutoffDate = new Date();

    if (filter === "Last 7 Days") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (filter === "Last 30 Days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else {
      cutoffDate = new Date("1970-01-01"); // ✅ All Time
    }

    return events.filter((event) => {
      const eventDate = new Date(event.from_date);
      return eventDate >= cutoffDate;
    });
  }, [events, filter]);

  // ✅ Calculate tickets sold per event
  const ticketData = useMemo(() => {
    return filteredEvents.map((event) => {
      const ticketsSold =
        event.ticketCategories?.reduce(
          (acc, cat) =>
            acc +
            (cat.quantity
              ? parseInt(cat.initial_quantity) - parseInt(cat.quantity)
              : 0),
          0
        ) || 0;

      return {
        name: event.title,
        sold: ticketsSold,
      };
    });
  }, [filteredEvents]);

  return (
    <Card className="bg-white dark:bg-gray-900 mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Tickets Sold per Event</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={16} />
              {filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(
              ["All Time", "Last 30 Days", "Last 7 Days"] as FilterOption[]
            ).map((key) => (
              <DropdownMenuItem key={key} onClick={() => setFilter(key)}>
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading events...</p>
        ) : isError ? (
          <p className="text-red-500 text-sm">Failed to fetch events</p>
        ) : ticketData.length === 0 ? (
          <p className="text-gray-500 text-sm">No events found</p>
        ) : (
          ticketData.map((event, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2"
            >
              <span className="font-medium">{event.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {event.sold} tickets
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
