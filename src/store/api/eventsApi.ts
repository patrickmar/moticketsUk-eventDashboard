import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TicketCategory {
  id: string;
  event_id: string;
  name: string;
  price: string;
  booking_fee: string;
  discount_price: string;
  wallet_discount: string;
  quantity: string;
  initial_quantity: string;
  noofpeople: string;
  cat_Image: string;
  Currency: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  lname: string;
  fname: string;
  email: string;
  qr: string;
  ticket_ref: string;
  pdf_file: string;
  event_id: string;
  ticket_class: string;
  amount: string;
  pay_reference: string;
  payment_channel: string;
  buy_date_time: string;
  channel: string;
  used: "0" | "1";
  used_date_time: string;
  processing_agent: string | null;
}

export interface EventImage {
  sn: string;
  eventId: string;
  img: string;
}

export interface Event {
  sn: string;
  merchantName: string;
  merchantId: string;
  submerchantId: string;
  hostid: string;
  Paystack_Acct: string;
  paystack_bearer: string;
  title: string;
  event_cat: string;
  country: string;
  currency: string;
  vendor: string;
  youtubeurl: string;
  event_id: string;
  slug: string;
  venue: string;
  from_date: string;
  from_time: string;
  to_date: string;
  to_time: string;
  members_flag: string;
  des: string;
  add_details: string;
  emailContent: string;
  date: string;
  time: string;
  ip: string;
  status: string;
  enableseat: string;
  seat_capacity: string;
  tags: string;
  ticketCategories: TicketCategory[];
  imgs: EventImage[];
}

interface EventsResponse {
  data: Event[];
}

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  endpoints: (builder) => ({
    getAllEvents: builder.query<EventsResponse, void>({
      query: () => "/host/allevents",
    }),
    getUpcomingEvents: builder.query<Event[], void>({
      query: () => ({
        url: "/event/upcomingevent/",
        method: "GET",
      }),
    }),
    getRecentPurchases: builder.query<Purchase[], string>({
      query: (eventId) => `/host/event/recentpurchases/${eventId}`,
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetUpcomingEventsQuery,
  useGetRecentPurchasesQuery,
} = eventsApi;
