import React from "react";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/AppIcon";

const BuildingSelector = ({
  selectedBuilding,
  selectedFloor,
  onBuildingChange,
  onFloorChange,
  buildings,
}) => {
  const buildingOptions = buildings?.map((building) => ({
    value: building?.id,
    label: building?.name,
    description: `${building?.totalRooms} rooms`,
  }));

  const floorOptions = selectedBuilding
    ? buildings
        ?.find((b) => b?.id === selectedBuilding)
        ?.floors?.map((floor) => ({
          value: floor?.id,
          label: floor?.name,
          description: `${floor?.rooms?.length} rooms`,
        })) || []
    : [];

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Building2" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Building Navigation
          </h2>
          <p className="text-sm text-muted-foreground">
            Select building and floor to manage rooms
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Building"
          placeholder="Select a building"
          options={buildingOptions}
          value={selectedBuilding}
          onChange={onBuildingChange}
          searchable
          required
        />

        <Select
          label="Floor"
          placeholder="Select a floor"
          options={floorOptions}
          value={selectedFloor}
          onChange={onFloorChange}
          disabled={!selectedBuilding}
          required
        />
      </div>
      {selectedBuilding && selectedFloor && (
        <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 text-sm text-accent">
            <Icon name="MapPin" size={16} />
            <span className="font-medium">
              {buildings?.find((b) => b?.id === selectedBuilding)?.name} -{" "}
              {
                buildings
                  ?.find((b) => b?.id === selectedBuilding)
                  ?.floors?.find((f) => f?.id === selectedFloor)?.name
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingSelector;
