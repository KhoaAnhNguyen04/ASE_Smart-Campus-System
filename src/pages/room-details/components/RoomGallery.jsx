import React, { useState } from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RoomGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images?.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Image" size={20} />
        Room Gallery
      </h2>
      <div className="space-y-4">
        <div className="relative w-full h-80 rounded-lg overflow-hidden bg-muted">
          <Image
            src={images?.[selectedImage]?.url}
            alt={images?.[selectedImage]?.alt}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-sm font-medium text-white bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full">
              {selectedImage + 1} / {images?.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={() => setIsFullscreen(true)}
              className="bg-background/50 backdrop-blur-sm text-white hover:bg-background/70"
            >
              Fullscreen
            </Button>
          </div>

          {images?.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70 transition-colors"
                aria-label="Previous image"
              >
                <Icon name="ChevronLeft" size={24} color="white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70 transition-colors"
                aria-label="Next image"
              >
                <Icon name="ChevronRight" size={24} color="white" />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-full h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={image?.url}
                alt={image?.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-card rounded-full hover:bg-muted transition-colors"
            aria-label="Close fullscreen"
          >
            <Icon name="X" size={24} />
          </button>
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            <Image
              src={images?.[selectedImage]?.url}
              alt={images?.[selectedImage]?.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomGallery;
