"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event, useGetRecentPurchasesQuery } from "@/store/api/eventsApi";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

interface Props {
  event: Event;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: Props) {
  const {
    title,
    venue,
    from_date,
    from_time,
    to_date,
    to_time,
    event_cat,
    currency,
    des,
    status,
    enableseat,
    seat_capacity,
    tags,
    sn,
  } = event;

  // ✅ Fetch recent purchases for this event
  const {
    data: purchases,
    isLoading: isPurchasesLoading,
    isError,
  } = useGetRecentPurchasesQuery(sn, {
    skip: !sn,
  });

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Category and Status */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{event_cat || "Uncategorized"}</Badge>
            <Badge variant={status === "Active" ? "default" : "outline"}>
              {status}
            </Badge>
            {enableseat === "1" && (
              <Badge variant="outline">
                Seats Enabled ({seat_capacity || "Unlimited"})
              </Badge>
            )}
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Start:</strong>{" "}
              {new Date(`${from_date}T${from_time}`).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(`${to_date}T${to_time}`).toLocaleString()}
            </p>
          </div>

          {/* Venue */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Venue:</strong> {venue || "Not specified"}
            </p>
          </div>

          {/* Description */}
          {des && (
            <div
              className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 prose prose-sm max-w-full"
              dangerouslySetInnerHTML={{ __html: des }}
            />
          )}

          {/* Tags */}
          {tags && tags.trim() !== "" && (
            <div className="flex flex-wrap gap-1">
              {tags.split(",").map((tag, index) => (
                <Badge key={index} className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Currency Info */}
          {currency && (
            <p className="text-xs text-gray-500">
              <strong>Currency:</strong> {currency}
            </p>
          )}

          <Separator />

          {/* ✅ Recent Purchases Section */}
          <div className="pt-4">
            <h3 className="text-md font-semibold mb-2">Recent Purchases</h3>

            {isPurchasesLoading ? (
              <p className="text-sm text-gray-500">
                Loading recent purchases...
              </p>
            ) : isError ? (
              <p className="text-sm text-red-500">Failed to load purchases.</p>
            ) : purchases && purchases.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="border rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {purchase.fname} {purchase.lname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(purchase.buy_date_time).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ticket: {purchase.ticket_class.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ref: {purchase.ticket_ref}
                    </p>
                    <p className="text-xs text-gray-500">
                      Email: {purchase.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Used:{" "}
                      {purchase.used === "1" ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No purchases found for this event.
              </p>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-xs text-muted-foreground pt-4">
            Event info provided by organizer. Subject to change.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
