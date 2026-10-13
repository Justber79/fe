"use client";
import { DeepKeys, FieldApi } from "@tanstack/react-form";
import style from "./index.module.css";
export interface IncludeClassName {
  className?: string;
}

interface Props<T, K extends DeepKeys<T>> extends IncludeClassName {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<T, K, any, any>;
}

export default function FieldInfo<T, K extends DeepKeys<T>>({ field, className }: Props<T, K>) {
  const showError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className={`${style["form-error"]} ${className}`}>
      {showError ? <em>{field.state.meta.errors.join(", ")}</em> : null}
    </div>
  );
}
