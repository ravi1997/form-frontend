import { create } from 'zustand';

const useFormStore = create((set) => ({
    form: null,
    setForm: (form) => set({ form }),

    formData: {},
    setFormData: (formData) => set({ formData }),

    repeatData: {},
    setRepeatData: (repeatData) => set({ repeatData }),
}));

export default useFormStore;
