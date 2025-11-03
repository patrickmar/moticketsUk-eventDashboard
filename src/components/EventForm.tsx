"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

// YouTube URL validation
const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

const formSchema = z.object({
  eventTitle: z.string().min(2, "Event title is required"),
  venue: z.string().min(2, "Venue is required"),
  description: z.string().min(10, "Description is required"),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  eventType: z.string().min(1, "Event type is required"),
  currency: z.string().min(1, "Currency is required"),
  youtubeUrl: z
    .string()
    .refine((val) => !val || youtubeRegex.test(val), {
      message: "Please enter a valid YouTube URL",
    })
    .optional(),
  ticketCategories: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        price: z.string().min(1, "Price is required"),
        qty: z.string().min(1, "Quantity is required"),
        numOfPeople: z.string().min(1, "Guest count is required"),
      })
    )
    .min(1, "At least one ticket category is required"),
  banner: z.instanceof(File).array().min(1, "At least one image is required"),
});

interface EventFormProps {
  initialData?: Partial<z.infer<typeof formSchema>> & { id?: string };
  onSuccess?: () => void;
}

export default function EventForm({ initialData, onSuccess }: EventFormProps) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>(initialData?.banner || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sn } = useParams<{ sn: string }>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTitle: "",
      venue: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "12:00",
      endTime: "12:00",
      eventType: "",
      currency: "",
      youtubeUrl: "",
      ticketCategories: [
        {
          name: "Regular",
          price: "200",
          qty: "10",
          numOfPeople: "1",
        },
      ],
      banner: [],
      ...initialData,
    },
  });

  // Extract YouTube ID for embed URL
  const youtubeUrl = form.watch("youtubeUrl");
  const youtubeId = youtubeUrl?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
  )?.[1];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all form data with proper type checking
      for (const [key, value] of Object.entries(values)) {
        if (key === "ticketCategories") {
          // Explicitly cast to ticket categories array type
          const categories = value as Array<{
            name: string;
            price: string;
            qty: string;
            numOfPeople: string;
          }>;
          categories.forEach((category, index) => {
            Object.entries(category).forEach(([subKey, subValue]) => {
              formData.append(
                `ticketCategories[${index}][${subKey}]`,
                subValue
              );
            });
          });
        } else if (key === "banner") {
          // Explicitly cast to File array type
          const files = value as File[];
          files.forEach((file) => formData.append("banner[]", file));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === "string" || typeof value === "number") {
          formData.append(key, value.toString());
        }
      }

      // Rest of your code remains the same...
      const endpoint = initialData?.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/update/eventticket/${sn}`
        : `${process.env.NEXT_PUBLIC_API_URL}/host_create/eventticket`;

      const response = await fetch(endpoint, {
        method: initialData?.id ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save event");

      const data = await response.json();
      if (data.error) throw new Error(data.message);

      toast.success(
        initialData?.id
          ? "Event updated successfully!"
          : "Event created successfully!"
      );
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 5) {
        toast.error("You can upload a maximum of 5 images");
        return;
      }
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      form.setValue("banner", updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    form.setValue("banner", newImages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="eventTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  {youtubeId && (
                    <div className="mt-2">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          width="100%"
                          height="315"
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner"
              render={() => (
                <FormItem>
                  <FormLabel>Event Images (Max 5)</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="cursor-pointer"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index}`}
                              className="h-24 w-24 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-0 right-0 p-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("startDate") ||
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Festival">Festival</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Executive Meeting">
                        Executive Meeting
                      </SelectItem>
                      <SelectItem value="Webinar">Webinar</SelectItem>
                      <SelectItem value="Comedy and Standup">
                        Comedy and Standup
                      </SelectItem>
                      <SelectItem value="Musical Show">Musical Show</SelectItem>
                      <SelectItem value="Trade Fair">Trade Fair</SelectItem>
                      <SelectItem value="Charity Events/Fundraisers">
                        Charity Events/Fundraisers
                      </SelectItem>
                      <SelectItem value="Club Nights and Bars">
                        Club Nights and Bars
                      </SelectItem>
                      <SelectItem value="Concerts">Concerts</SelectItem>
                      <SelectItem value="Cultural Events">
                        Cultural Events
                      </SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                      <SelectItem value="Film Screenings">
                        Film Screenings
                      </SelectItem>
                      <SelectItem value="Galas/Dinners">
                        Galas/Dinners
                      </SelectItem>
                      <SelectItem value="Gigs">Gigs</SelectItem>
                      <SelectItem value="Sports Events">
                        Sports Events
                      </SelectItem>
                      <SelectItem value="Theatre/Performing Arts">
                        Theatre/Performing Arts
                      </SelectItem>
                      <SelectItem value="Workshops">Workshops</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Ticket Categories</h3>
              {form.watch("ticketCategories").map((_, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name={`ticketCategories.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ticketCategories.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ticketCategories.${index}.qty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ticketCategories.${index}.numOfPeople`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Guests per ticket</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const categories = form.getValues("ticketCategories");
                        form.setValue(
                          "ticketCategories",
                          categories.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Remove Category
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => {
                  form.setValue("ticketCategories", [
                    ...form.getValues("ticketCategories"),
                    {
                      name: "",
                      price: "",
                      qty: "",
                      numOfPeople: "",
                    },
                  ]);
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : initialData?.id
                ? "Update Event"
                : "Create Event"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
