import { useState, useCallback, ChangeEvent } from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export default function useInput(initialValue = "") {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = useCallback((event: ChangeEvent<InputElement>) => {
    setValue(event.target.value);
  }, []);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, onChange, reset, setValue] as const;
}
