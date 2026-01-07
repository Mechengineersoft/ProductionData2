import { useState } from "react";
import { HeaderControls } from "@/components/HeaderControls";
import { EntryRowForm } from "@/components/EntryRowForm";
import { HeaderData, EntryRow, createEmptyEntry } from "@/types/entry";
import { appendToGoogleSheet } from "@/lib/googleSheets";
import { Button } from "@/components/ui/button";
import { Plus, Send, Loader2, Database, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [headerData, setHeaderData] = useState<HeaderData>({
    machine: "",
    date: new Date(),
    shift: "",
  });

  const [entries, setEntries] = useState<EntryRow[]>([createEmptyEntry()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHeaderChange = (data: Partial<HeaderData>) => {
    setHeaderData((prev) => ({ ...prev, ...data }));
  };

  const handleEntryUpdate = (id: string, field: keyof EntryRow, value: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const handleAddEntry = () => {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const validateForm = (): string | null => {
    if (!headerData.machine) return "Please select a Machine";
    if (!headerData.date) return "Please select a Date";
    if (!headerData.shift) return "Please select a Shift";

    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].finish) {
        return `Please select Finish for entry #${i + 1}`;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const result = await appendToGoogleSheet(headerData, entries);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Data saved successfully!", {
        description: `${entries.length} entries submitted`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      // Reset entries but keep header data for next submission
      setEntries([createEmptyEntry()]);
    } else {
      toast.error("Failed to save data", {
        description: result.error,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="bg-header text-header-foreground py-4 px-4 shadow-elevated">
        <div className="container max-w-7xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Production Data Entry</h1>
            <p className="text-xs text-header-foreground/70">Machine Processing Records</p>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
        {/* Session Settings */}
        <HeaderControls headerData={headerData} onHeaderChange={handleHeaderChange} />

        {/* Entry Rows Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Data Entries
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({entries.length} {entries.length === 1 ? "row" : "rows"})
              </span>
            </h3>
            <Button
              onClick={handleAddEntry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          </div>

          <div className="space-y-3">
            {entries.map((entry, index) => (
              <EntryRowForm
                key={entry.id}
                entry={entry}
                index={index}
                onUpdate={handleEntryUpdate}
                onRemove={handleRemoveEntry}
                canRemove={entries.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleAddEntry}
            variant="secondary"
            className="flex-1 sm:flex-none gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Entry
          </Button>
          <div className="flex-1" />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary-gradient gap-2 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit to Sheet
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border mt-8">
        Production Data Entry System
      </footer>
    </div>
  );
};

export default Index;
