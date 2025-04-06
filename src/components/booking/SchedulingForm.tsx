
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelect } from "@/components/ui/time-select";
import { format } from "date-fns";

interface SchedulingFormProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedPackage: string;
  handleSubmit: () => void;
  goBack: () => void;
}

export const SchedulingForm: React.FC<SchedulingFormProps> = ({
  date,
  setDate,
  time,
  setTime,
  formErrors,
  setFormErrors,
  selectedPackage,
  handleSubmit,
  goBack,
}) => {
  const disabledDates = {
    before: new Date(),
  };

  const onDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && formErrors['date']) {
      const { date, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  const onTimeChange = (newTime: string) => {
    setTime(newTime);
    if (newTime && formErrors['time']) {
      const { time, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={disabledDates}
              className="border rounded-md p-3"
            />
            {formErrors['date'] && (
              <p className="text-sm font-medium text-destructive mt-1">{formErrors['date']}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Time</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={time === t ? "default" : "outline"}
                  onClick={() => onTimeChange(t)}
                  className="w-full"
                >
                  {t}
                </Button>
              ))}
            </div>
            {formErrors['time'] && (
              <p className="text-sm font-medium text-destructive mt-1">{formErrors['time']}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Or Select Custom Time</h3>
            <TimeSelect
              value={time}
              onChange={onTimeChange}
              startHour={8}
              endHour={18}
              interval={30}
              placeholder="Select a time"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4 bg-muted/30">
        <h3 className="font-medium">Selected Schedule</h3>
        <div className="mt-1">
          <p className="text-sm text-muted-foreground">
            {date ? format(date, "PPPP") : "No date selected"}{" "}
            {time ? `at ${time}` : ""}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
};
