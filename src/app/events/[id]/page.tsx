import { Metadata } from 'next';
import EventHeader from '../../components/EventHeader';

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Event Details',
};

export default function EventDetailsPage({ params }: PageProps) {
  const eventId = params.id;

  // Temporary mock data until you fetch real event details
  return (
    <div>
      <EventHeader
        eventName="Sample Event"
        eventDateTime="August 12, 2025 • 7:30 PM"
        venueName="Hollywood Bowl"
        venueLocation="Los Angeles, CA"
      />
      <p className="p-4">Full event page coming soon for ID: {eventId}</p>
    </div>
  );
}
