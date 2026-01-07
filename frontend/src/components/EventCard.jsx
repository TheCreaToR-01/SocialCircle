import React from 'react';
import { Calendar, Clock, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

function EventCard({ event }) {
  const eventDate = new Date(event.event_datetime);

  return (
    <div className="bg-white border border-border/50 shadow-xl shadow-emerald-900/5 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300" data-testid={`event-card-${event.event_id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="inline-block bg-accent/20 text-accent-foreground text-xs px-3 py-1 rounded-full mb-2">
            {event.category}
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
            {event.title}
          </h3>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-6 line-clamp-2">
        {event.description}
      </p>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{eventDate.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{event.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <User className="w-4 h-4 text-primary" />
          <span>Hosted by {event.mentor_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>₹{event.price_per_lead} per person</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {event.available_slots} slots available
        </span>
        <Link to={`/events/${event.event_id}`}>
          <Button className="rounded-full bg-primary hover:bg-primary/90" data-testid={`view-event-${event.event_id}`}>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
