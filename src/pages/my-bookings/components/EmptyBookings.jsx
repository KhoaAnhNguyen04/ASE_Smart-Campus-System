import React from 'react';
import Icon from "../../../components/AppIcon";

const EmptyBookings = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-12 text-center">
      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">No bookings found</p>
    </div>
  );
};

export default EmptyBookings;