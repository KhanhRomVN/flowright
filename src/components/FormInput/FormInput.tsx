import React from 'react';
import { Input } from '@/components/ui/input';

interface InputField {
  title: string;
  placeholder: string;
  key: string;
  type?: string;
}

interface FormInputProps {
  fields: InputField[];
  values: { [key: string]: string };
  onChange: (key: string, value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({ fields, values, onChange }) => {
  return (
    <>
      {fields.map((field) => (
        <div key={field.key} className="mb-4">
          <label htmlFor={field.key} className="block text-sm font-medium text-gray-300 mb-1">
            {field.title}
          </label>
          <Input
            type={field.type || 'text'}
            id={field.key}
            placeholder={field.placeholder}
            className="bg-gray-800 text-white"
            value={values[field.key]}
            onChange={(e) => onChange(field.key, e.target.value)}
            required
          />
        </div>
      ))}
    </>
  );
};

export default FormInput;