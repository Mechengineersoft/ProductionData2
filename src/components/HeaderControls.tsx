import { HeaderData, MACHINE_OPTIONS, SHIFT_OPTIONS } from "@/types/entry";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HeaderControlsProps {
  headerData: HeaderData;
  onHeaderChange: (data: Partial<HeaderData>) => void;
}

export const HeaderControls = ({ headerData, onHeaderChange }: HeaderControlsProps) => {
  return (
    <div className="bg-header text-header-foreground rounded-xl p-4 md:p-6 shadow-elevated">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Settings2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Session Settings</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Machine Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-header-foreground/70">
            Machine <span className="text-destructive">*</span>
          </label>
          <Select
            value={headerData.machine}
            onValueChange={(value) => onHeaderChange({ machine: value })}
          >
            <SelectTrigger className="bg-header-foreground/10 border-header-foreground/20 text-header-foreground h-10">
              <SelectValue placeholder="Select Machine" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {MACHINE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-header-foreground/70">
            Date <span className="text-destructive">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 bg-header-foreground/10 border-header-foreground/20 text-header-foreground hover:bg-header-foreground/20",
                  !headerData.date && "text-header-foreground/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {headerData.date ? format(headerData.date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <Calendar
                mode="single"
                selected={headerData.date}
                onSelect={(date) => onHeaderChange({ date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Shift Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-header-foreground/70">
            Shift <span className="text-destructive">*</span>
          </label>
          <Select
            value={headerData.shift}
            onValueChange={(value) => onHeaderChange({ shift: value })}
          >
            <SelectTrigger className="bg-header-foreground/10 border-header-foreground/20 text-header-foreground h-10">
              <SelectValue placeholder="Select Shift" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {SHIFT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "D" ? "Day (D)" : "Night (N)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
