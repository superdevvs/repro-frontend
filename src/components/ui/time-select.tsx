
import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Generates time slots for a day
const generateTimeSlots = (
  startHour: number = 8, 
  endHour: number = 18, 
  interval: number = 30
): string[] => {
  const slots: string[] = []
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const isPM = hour >= 12
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = displayHour.toString()
      const formattedMinute = minute.toString().padStart(2, '0')
      const meridiem = isPM ? 'PM' : 'AM'
      
      slots.push(`${formattedHour}:${formattedMinute} ${meridiem}`)
      
      // Stop at the end hour
      if (hour === endHour && minute >= 0) break
    }
  }
  
  return slots
}

export interface TimeSelectProps {
  value?: string
  onChange?: (time: string) => void
  disabled?: boolean
  availableTimes?: string[]
  className?: string
  startHour?: number
  endHour?: number
  interval?: number
  placeholder?: string
}

export function TimeSelect({
  value,
  onChange,
  disabled,
  availableTimes,
  className,
  startHour = 8,
  endHour = 18,
  interval = 30,
  placeholder = "Select time",
}: TimeSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Generate all possible time slots
  const allTimeSlots = React.useMemo(() => 
    generateTimeSlots(startHour, endHour, interval), 
    [startHour, endHour, interval]
  )
  
  // Filter time slots based on availability if provided
  const timeSlots = availableTimes ? 
    allTimeSlots.filter(time => availableTimes.includes(time)) : 
    allTimeSlots

  // Handle time selection
  const handleSelectTime = (time: string) => {
    onChange?.(time)
    setOpen(false)
    setSearchQuery("")
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-start text-left font-normal", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[220px]">
        <Command>
          <CommandInput 
            placeholder="Search time..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No time found.</CommandEmpty>
            <CommandGroup>
              {timeSlots
                .filter(time => 
                  searchQuery === "" || 
                  time.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((time) => (
                  <CommandItem
                    key={time}
                    value={time}
                    onSelect={() => handleSelectTime(time)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      value === time && "bg-primary/10 text-primary"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    {time}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
