import { useState } from 'react';

export function useform(initialValues) {
  const [values, setValues] = useState(initialValues);

  return [
    values,
    (e) => {
      console.log(e.target.type);
      setValues({
        ...values,
        [e.target.name]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      });
    },
  ];
}
