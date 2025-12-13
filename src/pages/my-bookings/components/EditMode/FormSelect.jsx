import React from "react";

const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  error, 
  placeholder,
  valueKey = "value",
  labelKey = "label"
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option disabled={true} value="">{placeholder}</option>
        {options?.map((option, index) => {
          // Handle both object and string arrays
          const optionValue = typeof option === 'string' ? option : option[valueKey];
          const optionLabel = typeof option === 'string' ? option : option[labelKey];
          
          return (
            <option key={optionValue || index} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormSelect;