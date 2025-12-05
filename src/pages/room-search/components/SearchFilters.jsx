import React, { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import Button from "../../../components/ui/Button";

const SearchFilters = ({ filters, onFilterChange, onReset, resultCount }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const buildingOptions = [
    { value: "all", label: "All Buildings" },
    { value: "engineering", label: "Engineering Building" },
    { value: "science", label: "Science Complex" },
    { value: "library", label: "Main Library" },
    { value: "business", label: "Business School" },
    { value: "arts", label: "Arts & Humanities" },
    { value: "medical", label: "Medical Sciences" },
  ];

  const capacityOptions = [
    { value: "any", label: "Any Capacity" },
    { value: "1-10", label: "1-10 people" },
    { value: "11-25", label: "11-25 people" },
    { value: "26-50", label: "26-50 people" },
    { value: "51-100", label: "51-100 people" },
    { value: "100+", label: "100+ people" },
  ];

  const equipmentOptions = [
    { value: "projector", label: "Projector" },
    { value: "whiteboard", label: "Whiteboard" },
    { value: "computer", label: "Computer" },
    { value: "video-conference", label: "Video Conference" },
    { value: "audio-system", label: "Audio System" },
    { value: "smart-board", label: "Smart Board" },
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleEquipmentToggle = (equipment) => {
    const currentEquipment = filters?.equipment || [];
    const newEquipment = currentEquipment?.includes(equipment)
      ? currentEquipment?.filter((e) => e !== equipment)
      : [...currentEquipment, equipment];
    onFilterChange({ ...filters, equipment: newEquipment });
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search by room name or ID..."
          value={filters?.searchQuery || ""}
          onChange={(e) => handleInputChange("searchQuery", e?.target?.value)}
          className="lg:col-span-2"
        />

        <Select
          placeholder="Select building"
          options={buildingOptions}
          value={filters?.building || "all"}
          onChange={(value) => handleInputChange("building", value)}
        />

        <Select
          placeholder="Select capacity"
          options={capacityOptions}
          value={filters?.capacity || "any"}
          onChange={(value) => handleInputChange("capacity", value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="date"
          label="Date"
          value={filters?.date || new Date()?.toISOString()?.split("T")?.[0]}
          onChange={(e) => handleInputChange("date", e?.target?.value)}
        />

        <Input
          type="time"
          label="Start Time"
          value={filters?.startTime || "09:00"}
          onChange={(e) => handleInputChange("startTime", e?.target?.value)}
        />

        <Input
          type="time"
          label="End Time"
          value={filters?.endTime || "17:00"}
          onChange={(e) => handleInputChange("endTime", e?.target?.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Checkbox
          label="Show only available rooms"
          checked={filters?.onlyAvailable || false}
          onChange={(e) =>
            handleInputChange("onlyAvailable", e?.target?.checked)
          }
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Advanced Filters
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {resultCount} rooms found
          </span>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
      {showAdvanced && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold mb-3">Required Equipment</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {equipmentOptions?.map((equipment) => (
              <Checkbox
                key={equipment?.value}
                label={equipment?.label}
                checked={(filters?.equipment || [])?.includes(equipment?.value)}
                onChange={() => handleEquipmentToggle(equipment?.value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
