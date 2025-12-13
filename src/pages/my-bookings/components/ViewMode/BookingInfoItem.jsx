import React from "react";
import Icon from "../../../../components/AppIcon";

const BookingInfoItem = ({ icon, children }) => {
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} size={18} className="text-muted-foreground mt-0.5" />
      {children}
    </div>
  );
};

export default BookingInfoItem;