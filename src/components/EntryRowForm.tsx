import { EntryRow, FINISH_OPTIONS, H_OPTIONS } from "@/types/entry";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EntryRowFormProps {
  entry: EntryRow;
  index: number;
  onUpdate: (id: string, field: keyof EntryRow, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const EntryRowForm = ({ entry, index, onUpdate, onRemove, canRemove }: EntryRowFormProps) => {
  const [showHFields, setShowHFields] = useState(false);

  const CompactSelect = ({
    value,
    onChange,
    options,
    placeholder,
    required = false,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: readonly string[];
    placeholder: string;
    required?: boolean;
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs bg-background border-input min-w-[70px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover z-50 max-h-60">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-xs">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const CompactInput = ({
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
  }: {
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    type?: string;
    className?: string;
  }) => (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-8 text-xs bg-background border-input ${className}`}
    />
  );

  return (
    <div className="entry-row animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
          #{index + 1}
        </span>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHFields(!showHFields)}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
        >
          H1-H17 {showHFields ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
        </Button>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(entry.id)}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main Fields Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
        <div className="space-y-1">
          <label className="label-compact">Block</label>
          <CompactInput
            value={entry.block}
            onChange={(val) => onUpdate(entry.id, "block", val)}
            placeholder="Block"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">Part</label>
          <CompactInput
            value={entry.part}
            onChange={(val) => onUpdate(entry.id, "part", val)}
            placeholder="Part"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">Thk cm</label>
          <CompactInput
            value={entry.thkCm}
            onChange={(val) => onUpdate(entry.id, "thkCm", val)}
            placeholder="Thk"
            type="number"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">Nos</label>
          <CompactInput
            value={entry.nos}
            onChange={(val) => onUpdate(entry.id, "nos", val)}
            placeholder="Nos"
            type="number"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">
            Finish <span className="text-destructive">*</span>
          </label>
          <CompactSelect
            value={entry.finish}
            onChange={(val) => onUpdate(entry.id, "finish", val)}
            options={FINISH_OPTIONS}
            placeholder="Finish"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">L cm</label>
          <CompactInput
            value={entry.lCm}
            onChange={(val) => onUpdate(entry.id, "lCm", val)}
            placeholder="L"
            type="number"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">H cm</label>
          <CompactInput
            value={entry.hCm}
            onChange={(val) => onUpdate(entry.id, "hCm", val)}
            placeholder="H"
            type="number"
          />
        </div>
        <div className="space-y-1">
          <label className="label-compact">Colour</label>
          <CompactInput
            value={entry.colour}
            onChange={(val) => onUpdate(entry.id, "colour", val)}
            placeholder="Colour"
          />
        </div>
        <div className="space-y-1 col-span-2 lg:col-span-2">
          <label className="label-compact">Remarks</label>
          <CompactInput
            value={entry.remarks}
            onChange={(val) => onUpdate(entry.id, "remarks", val)}
            placeholder="Remarks"
          />
        </div>
      </div>

      {/* H1-H17 Fields (Collapsible) */}
      {showHFields && (
        <div className="mt-3 pt-3 border-t border-entry-row-border">
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-17 gap-2">
            {(["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13", "h14", "h15", "h16", "h17"] as const).map((field) => (
              <div key={field} className="space-y-1">
                <label className="label-compact">{field.toUpperCase()}</label>
                <CompactSelect
                  value={entry[field]}
                  onChange={(val) => onUpdate(entry.id, field, val)}
                  options={H_OPTIONS}
                  placeholder="-"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
