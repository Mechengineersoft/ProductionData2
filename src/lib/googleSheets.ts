import { EntryRow, HeaderData } from "@/types/entry";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const appendToGoogleSheet = async (
  headerData: HeaderData,
  entries: EntryRow[]
): Promise<{ success: boolean; error?: string }> => {
  const formattedDate = headerData.date ? format(headerData.date, "yyyy-MM-dd") : "";
  
  const entriesWithHeader = entries.map((entry) => ({
    machine: headerData.machine,
    date: formattedDate,
    shift: headerData.shift,
    block: entry.block,
    part: entry.part,
    thkCm: entry.thkCm,
    nos: entry.nos,
    finish: entry.finish,
    lCm: entry.lCm,
    hCm: entry.hCm,
    colour: entry.colour,
    remarks: entry.remarks,
    h1: entry.h1,
    h2: entry.h2,
    h3: entry.h3,
    h4: entry.h4,
    h5: entry.h5,
    h6: entry.h6,
    h7: entry.h7,
    h8: entry.h8,
    h9: entry.h9,
    h10: entry.h10,
    h11: entry.h11,
    h12: entry.h12,
    h13: entry.h13,
    h14: entry.h14,
    h15: entry.h15,
    h16: entry.h16,
    h17: entry.h17,
  }));

  try {
    const { data, error } = await supabase.functions.invoke('append-to-sheet', {
      body: { entries: entriesWithHeader },
    });

    if (error) {
      console.error("Edge function error:", error);
      return {
        success: false,
        error: error.message || "Failed to call backend function",
      };
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || "Failed to append data to Google Sheets",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Network error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
};
