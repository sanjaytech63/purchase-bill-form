import React, { useEffect, useRef } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { PurchaseBillFormData } from "@/lib/validation";
import { FormErrors, getErrorMessage } from "@/lib/errorUtils";
import type { BaseSelectRef } from "rc-select";
import type { InputRef } from "antd";

const { Option } = Select;

interface FormFieldProps {
  label: string;
  name: keyof PurchaseBillFormData;
  type: "text" | "number" | "select" | "date" | "textarea";
  required?: boolean;
  register: UseFormRegister<PurchaseBillFormData>;
  errors: FormErrors;
  setValue: UseFormSetValue<PurchaseBillFormData>;
  trigger: UseFormTrigger<PurchaseBillFormData>;
  value: string | number | undefined;
  options?: Array<{ id: string; name: string; vendorId?: string }>;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  selectRef?: React.Ref<BaseSelectRef>;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  required = false,
  register,
  errors,
  setValue,
  trigger,
  value,
  options = [],
  disabled = false,
  placeholder,
  autoFocus = false,
  onKeyDown,
  selectRef,
}) => {
  const inputRef = useRef<InputRef>(null);
  const error = getErrorMessage(errors, name);
  const fieldId = `field-${name}`;

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleBlur = () => {
    trigger(name);
  };

  const handleChange = (newValue: string | number) => {
    setValue(name, newValue, { shouldValidate: true });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(name, e.target.value, { shouldValidate: true });
  };

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select
            {...register(name)}
            value={value ?? undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            ref={selectRef}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const children = option?.children;
              const text =
                typeof children === "string"
                  ? children
                  : String(children ?? "");
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            onKeyDown={onKeyDown}
            style={{ width: "100%" }}
            status={error ? "error" : ""}
          >
            {options.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date, dateString) =>
              setValue(name, dateString as string)
            }
            onBlur={handleBlur}
            format="YYYY-MM-DD"
            disabled={disabled}
            onKeyDown={onKeyDown}
            status={error ? "error" : ""}
          />
        );

      case "number":
        return (
          <Input
            {...register(name, { valueAsNumber: true })}
            type="number"
            value={value || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            ref={inputRef}
            onKeyDown={onKeyDown}
            min={0}
            step={name.includes("discount") ? "0.01" : "1"}
            status={error ? "error" : ""}
          />
        );

      case "textarea":
        return (
          <Input.TextArea
            {...register(name)}
            value={value || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            ref={inputRef}
            onKeyDown={onKeyDown}
            rows={3}
            status={error ? "error" : ""}
          />
        );

      default: // text
        return (
          <Input
            {...register(name)}
            value={value || ""}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            ref={inputRef}
            onKeyDown={onKeyDown}
            status={error ? "error" : ""}
          />
        );
    }
  };

  return (
    <Form.Item
      label={
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      }
      validateStatus={error ? "error" : ""}
      help={error}
      htmlFor={fieldId}
      className="mb-0"
    >
      {renderField()}
    </Form.Item>
  );
};

export default FormField;
