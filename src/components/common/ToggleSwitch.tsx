
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  description,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <div className="space-y-0.5">
        <label className="text-sm font-medium">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export default ToggleSwitch;
