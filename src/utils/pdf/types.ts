export interface Item {
  type: string;
  door?: {
    panelType: string;
    width: number;
    height: number;
    handing: string;
    slabType: string;
    hardwareType: string;
    measurementGiven?: string;
  };
  style?: string;
  subOption?: string;
  width: number;
  height: number;
  color?: string;
  material?: string;
  notes?: string;
  measurementGiven?: string;
}