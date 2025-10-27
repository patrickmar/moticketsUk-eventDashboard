"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TicketCheck, CalendarCheck2, TrendingUp } from "lucide-react";
import { useGetAllEventsQuery } from "../store/api/eventsApi";

export default function DashboardSummary() {
  const { data, isLoading, isError } = useGetAllEventsQuery();

  if (isLoading) {
    return <p className="p-4">Loading dashboard...</p>;
  }

  if (isError || !data?.data) {
    return <p className="p-4 text-red-500">Failed to load dashboard data.</p>;
  }

  // ---------------------------
  // CALCULATE STATS FROM DATA
  // ---------------------------

  const events = data.data;

  // Total number of events
  const totalEvents = events.length;

  // Total tickets across all events
  const totalTickets = events.reduce((sum, event) => {
    return (
      sum +
      event.ticketCategories?.reduce(
        (catSum, cat) => catSum + Number(cat.initial_quantity || 0),
        0
      )
    );
  }, 0);

  // Total tickets sold
  const totalTicketsSold = events.reduce((sum, event) => {
    return (
      sum +
      event.ticketCategories?.reduce((catSum, cat) => {
        const initial = Number(cat.initial_quantity || 0);
        const qty = Number(cat.quantity || 0);

        // If remaining tickets > total tickets, assume quantity = sold tickets
        if (qty > initial) {
          return catSum + qty; // Case B: quantity = sold
        }

        // Otherwise, assume quantity = remaining
        return catSum + (initial - qty); // Case A: quantity = remaining
      }, 0)
    );
  }, 0);

  const activeEvents = events.filter(
    (event) => event.status === "Active"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Total Events */}
      <Card className="bg-white dark:bg-gray-900">
        <CardContent className="p-4 flex items-center gap-4">
          <CalendarCheck2 className="text-blue-500" size={32} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Events
            </p>
            <h3 className="text-xl font-bold">{totalEvents}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Sold */}
      <Card className="bg-white dark:bg-gray-900">
        <CardContent className="p-4 flex items-center gap-4">
          <TicketCheck className="text-green-500" size={32} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tickets Sold
            </p>
            <h3 className="text-xl font-bold">{totalTicketsSold}</h3>
          </div>
        </CardContent>
      </Card>

      {/* Active Events */}
      <Card className="bg-white dark:bg-gray-900 shadow-md rounded-2xl">
        <CardContent className="p-4 flex items-center gap-4">
          <TrendingUp className="text-purple-500" size={32} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Active Events
            </p>
            <h3 className="text-xl font-bold">{activeEvents}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
