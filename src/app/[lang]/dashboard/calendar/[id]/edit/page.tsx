import { CreateEvent } from "@/components/Dashboard/Calendar/CreateEvent";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreateEvent eventId={Number(id)} />;
}
