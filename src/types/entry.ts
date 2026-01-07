export interface EntryRow {
  id: string;
  block: string;
  part: string;
  thkCm: string;
  nos: string;
  finish: string;
  lCm: string;
  hCm: string;
  colour: string;
  remarks: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  h7: string;
  h8: string;
  h9: string;
  h10: string;
  h11: string;
  h12: string;
  h13: string;
  h14: string;
  h15: string;
  h16: string;
  h17: string;
}

export interface HeaderData {
  machine: string;
  date: Date | undefined;
  shift: string;
}

export const MACHINE_OPTIONS = [
  "Polishing Cutter",
  "6H",
  "12H",
  "17H",
  "Shot Blast",
  "Buffing",
  "HP1",
  "HP2",
  "HP3",
  "HP4",
] as const;

export const SHIFT_OPTIONS = ["D", "N"] as const;

export const FINISH_OPTIONS = [
  "Grinding",
  "D Polish",
  "E Polish",
  "Leather",
  "Lapotra",
  "Honed",
  "Polish Remove",
  "Thickness Decrease",
  "Epoxy Remove",
  "Brushing",
  "Washing",
  "Shot Blast",
  "Cleaning",
  "Backside Cleaning",
  "Brush Cleaning",
  "Flamed Brush Wash",
  "NA",
  "Rust Remover Remove",
 
  "Other",
] as const;

export const H_OPTIONS = [
  "DB24", "DB36", "DB46", "DB60", "DB80", "DB120", "DB180", "DB220", "DB240", "DB320",
  "SB120", "SB180", "SB240", "SB320", "SB400",
  "LB400", "LB500", "LB600", "LB800", "LB1200",
  "ER1", "ER2",
  "M120", "M180", "M220",
  "R80", "R100", "R120", "R150", "R180", "R200", "R220", "R280", "R300", "R320", "R400", "R600", "R800", "R1000", "R1200", "R1500", "R2000", "R3000", "R5000", "R10000",
  "Lux1", "Lux2", "Lux3",
  "24D", "30D", "34D", "36D", "46D", "60D", "70D", "80D", "100D", "120D", "150D", "180D", "220D",
] as const;

export const createEmptyEntry = (): EntryRow => ({
  id: crypto.randomUUID(),
  block: "",
  part: "",
  thkCm: "",
  nos: "",
  finish: "",
  lCm: "",
  hCm: "",
  colour: "",
  remarks: "",
  h1: "", h2: "", h3: "", h4: "", h5: "", h6: "", h7: "", h8: "",
  h9: "", h10: "", h11: "", h12: "", h13: "", h14: "", h15: "", h16: "", h17: "",
});
