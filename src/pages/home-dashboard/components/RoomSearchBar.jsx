import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";

const RoomSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  const mockSuggestions = [
    {
      id: "R101",
      name: "Lecture Hall A",
      building: "Science Building",
      type: "room",
    },
    {
      id: "R205",
      name: "Computer Lab 2",
      building: "Engineering Block",
      type: "room",
    },
    {
      id: "R310",
      name: "Conference Room",
      building: "Administration",
      type: "room",
    },
    { id: "SB", name: "Science Building", type: "building" },
    { id: "EB", name: "Engineering Block", type: "building" },
    { id: "R150", name: "Study Room 5", building: "Library", type: "room" },
    {
      id: "R401",
      name: "Seminar Hall",
      building: "Arts Building",
      type: "room",
    },
    { id: "LIB", name: "Library", type: "building" },
  ];

  const filteredSuggestions = searchQuery?.trim()
    ? mockSuggestions
        ?.filter(
          (item) =>
            item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            (item?.building &&
              item?.building
                ?.toLowerCase()
                ?.includes(searchQuery?.toLowerCase()))
        )
        ?.slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    if (query?.trim()) {
      navigate(`/room-search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.type === "room") {
      navigate(`/room-details?id=${suggestion?.id}`);
    } else {
      navigate(`/room-search?building=${encodeURIComponent(suggestion?.name)}`);
    }
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions?.length === 0) {
      if (e?.key === "Enter") {
        handleSearch(searchQuery);
      }
      return;
    }

    switch (e?.key) {
      case "ArrowDown":
        e?.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions?.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e?.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e?.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions?.[selectedIndex]);
        } else {
          handleSearch(searchQuery);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search by room name, ID, or building..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e?.target?.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery?.trim() && setShowSuggestions(true)}
          className="pr-12"
        />
        <button
          onClick={() => handleSearch(searchQuery)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-accent/10 transition-colors"
          aria-label="Search rooms"
        >
          <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
        </button>
      </div>
      {showSuggestions && filteredSuggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={suggestion?.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/10 transition-colors text-left ${
                index === selectedIndex ? "bg-accent/10" : ""
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  suggestion?.type === "room"
                    ? "bg-primary/10"
                    : "bg-secondary/10"
                }`}
              >
                <Icon
                  name={suggestion?.type === "room" ? "DoorOpen" : "Building2"}
                  size={20}
                  color={
                    suggestion?.type === "room"
                      ? "var(--color-primary)"
                      : "var(--color-secondary)"
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {suggestion?.name}
                </p>
                {suggestion?.building && (
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion?.building} • {suggestion?.id}
                  </p>
                )}
              </div>
              <Icon
                name="ChevronRight"
                size={16}
                color="var(--color-muted-foreground)"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSearchBar;
