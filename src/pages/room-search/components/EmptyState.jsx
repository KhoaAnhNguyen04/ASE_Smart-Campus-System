import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name="SearchX" size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No rooms found
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We couldn't find any rooms matching your search criteria. Try adjusting
        your filters or search terms.
      </p>
      <Button
        variant="outline"
        onClick={onReset}
        iconName="RotateCcw"
        iconPosition="left"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default EmptyState;
