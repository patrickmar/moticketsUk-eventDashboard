"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DollarSign, Filter } from "lucide-react";
import { useGetAllEventsQuery, Event } from "@/store/api/eventsApi";

export default function RevenuePerEvent() {
  // ✅ fetch all events
  const { data, isLoading } = useGetAllEventsQuery();
  const events: Event[] = data?.data || [];

  const filters = ["All Time", "Last 30 Days", "Last 7 Days"] as const;
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("Last 30 Days");

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-900 mb-6">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-lg">
            <DollarSign size={20} className="text-green-500" />
            Revenue per Event
          </CardTitle>
        </CardHeader>
        <CardContent>Loading revenue data...</CardContent>
      </Card>
    );
  }

  // ✅ Calculate revenue per event
  const revenueData = events.map((event) => {
    const gross =
      event.ticketCategories?.reduce((acc, cat) => {
        const qty = parseInt(cat.quantity || "0");
        const price = parseFloat(cat.price || "0");
        return acc + qty * price;
      }, 0) || 0;

    const net = gross * 0.95; // apply 5% fee

    return {
      name: event.title,
      gross,
      net,
      currency: event.currency || "USD", // fallback if API doesn't send
    };
  });

  return (
    <Card className="bg-white dark:bg-gray-900 mb-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex gap-2 items-center text-lg">
          <DollarSign size={20} className="text-green-500" />
          Revenue per Event
        </CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter size={16} />
              {filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filters.map((key) => (
              <DropdownMenuItem key={key} onClick={() => setFilter(key)}>
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3">
        {revenueData.map((event, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 dark:border-gray-800 pb-3"
          >
            <div className="font-medium">{event.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-6 sm:justify-end">
              <div>
                Gross: {event.currency} {event.gross.toLocaleString()}
              </div>
              <div>
                Net: {event.currency} {event.net.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
