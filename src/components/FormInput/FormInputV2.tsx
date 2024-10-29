import React from 'react';
import { Input } from '@/components/ui/input';

interface InputField {
  key: string;
  title: string;
  placeholder: string;
  type: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  halfWidth?: boolean;
}

interface FormInputV2Props {
  fields: InputField[];
  values: { [key: string]: string };
  onChange: (key: string, value: string) => void;
}

const FormInputV2: React.FC<FormInputV2Props> = ({ fields, values, onChange }) => {
  return (
    <>
      {fields.map((field) => (
        <div key={field.key} className={`mb-4 ${field.halfWidth ? 'col-span-1' : 'col-span-2'}`}>
          <label htmlFor={field.key} className="block text-sm font-medium text-gray-300 mb-1">
            {field.title}
          </label>
          <div className="relative">
            {field.icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {field.icon}
              </div>
            )}
            <Input
              type={field.type}
              id={field.key}
              placeholder={field.placeholder}
              className={`bg-gray-800 text-white ${field.icon ? 'pl-10' : ''} ${field.endIcon ? 'pr-10' : ''}`}
              value={values[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              required
            />
            {field.endIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {field.endIcon}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default FormInputV2;