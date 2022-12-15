import create from "zustand";

export const useResetColors = create<{
  resetColors: boolean;
  setResetColors: (trueOrFalse: boolean) => void;
}>((set) => ({
  resetColors: false,
  setResetColors: (trueOrFalse) =>
    set((state) => ({
      ...state,
      resetColors: trueOrFalse,
    })),
}));

export const useTabBeingDraggedColor = create<{
  tabBeingDraggedColor: string;
  setTabBeingDraggedColor: (color: string) => void;
}>((set) => ({
  tabBeingDraggedColor: "",
  setTabBeingDraggedColor: (color) =>
    set((state) => ({
      ...state,
      tabBeingDraggedColor: color,
    })),
}));
