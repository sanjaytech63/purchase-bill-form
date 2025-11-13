import { PurchaseBillFormData } from "./validation";

const STORAGE_KEY = "purchase-bill-form-data";

export const saveFormData = (data: PurchaseBillFormData): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadFormData = (): PurchaseBillFormData | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored form data:", error);
      }
    }
  }
  return null;
};

export const clearFormData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
};
