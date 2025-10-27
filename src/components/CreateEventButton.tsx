// components/CreateEventButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Pencil } from "lucide-react";
import EventForm from "./EventForm";

interface CreateEventButtonProps {
  eventData?: any; // Your event data type
  variant?: "create" | "edit";
}

export default function CreateEventButton({
  eventData,
  variant = "create",
}: CreateEventButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "create" ? (
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {variant === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <EventForm initialData={eventData} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
