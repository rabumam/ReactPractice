"use client";
import { useState, ChangeEvent, FormEvent } from "react";

function useForm<T>(initialValues: T, validate?: (values: T) => Partial<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (
    e: FormEvent,
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    e.preventDefault();
    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
  };

  return { values, errors, touched, handleChange, handleSubmit, isSubmitting };
}

export default useForm;
