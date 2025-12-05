import React from "react";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const SortControls = ({ sortBy, onSortChange, viewMode, onViewModeChange }) => {
  const sortOptions = [
    { value: "availability", label: "Availability" },
    { value: "capacity-asc", label: "Capacity (Low to High)" },
    { value: "capacity-desc", label: "Capacity (High to Low)" },
    { value: "building", label: "Building Name" },
    { value: "proximity", label: "Proximity to Location" },
    { value: "name", label: "Room Name" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Icon name="ArrowUpDown" size={18} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Sort by:</span>
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
          className="w-48"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">View:</span>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            iconName="Grid3x3"
            className="h-8 w-8 p-0"
          />
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            iconName="List"
            className="h-8 w-8 p-0"
          />
        </div>
      </div>
    </div>
  );
};

export default SortControls;
