import { create } from "zustand";

interface FeedbackModalStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useFeedbackModal = create<FeedbackModalStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export default useFeedbackModal;
