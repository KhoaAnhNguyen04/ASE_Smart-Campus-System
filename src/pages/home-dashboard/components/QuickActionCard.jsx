import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const QuickActionCard = ({
  title,
  description,
  icon,
  iconColor,
  bgColor,
  path,
  badge,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="relative w-full p-6 bg-card border border-border rounded-lg hover:shadow-lg hover-lift transition-all text-left group"
    >
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent">
          {badge}
        </span>
      )}

      <div className={`inline-flex p-3 rounded-lg ${bgColor} mb-4`}>
        <Icon name={icon} size={24} color={iconColor} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <span>Access now</span>
        <Icon
          name="ArrowRight"
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </div>
    </button>
  );
};

export default QuickActionCard;
