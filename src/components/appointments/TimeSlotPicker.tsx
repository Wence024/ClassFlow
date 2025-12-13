import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  value?: string;
  onChange: (time: string) => void;
  bookedSlots?: string[];
  disabled?: boolean;
}

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00"
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

export function TimeSlotPicker({ value, onChange, bookedSlots = [], disabled }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {TIME_SLOTS.map((slot) => {
        const isBooked = bookedSlots.includes(slot) || bookedSlots.includes(`${slot}:00`);
        const isSelected = value === slot || value === `${slot}:00`;

        return (
          <Button
            key={slot}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            disabled={disabled || isBooked}
            onClick={() => onChange(slot)}
            className={cn(
              "text-xs",
              isBooked && "opacity-50 line-through"
            )}
          >
            {formatTime(slot)}
          </Button>
        );
      })}
    </div>
  );
}
