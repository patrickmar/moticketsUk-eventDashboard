import Layout from "@/components/DashboardLayout";
import DashboardSummary from "@/components/DashboardSummary";
import ProtectedRoute from "@/components/ProtectedRoute";
import RevenuePerEvent from "@/components/RevenuePerEvent";
import TicketsSoldPerEvent from "@/components/TicketsSoldPerEvent";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <DashboardSummary />
        <UpcomingEvents />
        <TicketsSoldPerEvent />
        <RevenuePerEvent />
      </Layout>
    </ProtectedRoute>
  );
}
