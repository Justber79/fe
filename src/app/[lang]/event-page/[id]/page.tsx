import EventPage from "@/components/EventPage";

export default async function PublicEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = Number(id);

  return <EventPage eventId={Number.isFinite(eventId) ? eventId : undefined} />;
}
