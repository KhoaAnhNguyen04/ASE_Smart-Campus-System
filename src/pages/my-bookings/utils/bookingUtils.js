export const validateBooking = (formData) => {
  const newErrors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(formData.date);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    newErrors.date = "Cannot book room in the past";
  }
  
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  if (selectedDate > thirtyDaysFromNow) {
    newErrors.date = "Cannot book room more than 30 days in advance";
  }
  
  if (formData.startTime && formData.endTime) {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    
    if (end <= start) {
      newErrors.endTime = "End time must be after start time";
    }
    
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours > 4) {
      newErrors.endTime = "Max booking duration is 4 hours";
    }
  }
  
  return newErrors;
};

export const getRoomValue = (roomLabel, roomOptions) => {
  const option = roomOptions.find(r => r.label === roomLabel);
  return option ? option.value : roomLabel;
};

export const getRoomLabel = (roomValue, roomOptions) => {
  const option = roomOptions.find(r => r.value === roomValue);
  return option ? option.label : roomValue;
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'cancelled':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};