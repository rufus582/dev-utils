import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { TextFormats, type TextFormatType } from "@/lib/text-formats";
import { Label } from "@/components/ui/label";

export default function TextFormatSelect({
  label,
  onTextFormatChange,
  supportedFormats,
  ...props
}: {
  label: string;
  supportedFormats: string[];
  onTextFormatChange: (textFormat: TextFormatType) => void;
} & React.ComponentProps<typeof Select>) {
  const textFormatArray: string[] = Object.keys(TextFormats);
  const supportedTextFormats = supportedFormats.filter((value) =>
    textFormatArray.includes(value)
  );
  const unsupportedFormats = supportedFormats.filter(
    (value) => !textFormatArray.includes(value)
  );

  if (unsupportedFormats.length > 0) {
    const errorMessage = `DEVELOPER ERROR :: The following formats provided in TextConverter.tsx are invalid: ${unsupportedFormats.join(
      ", "
    )}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const handleOnValueChange = (value: string) => {
    const textFormat = Object.values(TextFormats).filter(
      (format) => value === format.displayable
    );
    if (textFormat.length > 0) {
      onTextFormatChange(textFormat[0]);
    }
  };

  return (
    <div className="flex gap-2">
      <Label>{label}</Label>
      <Select {...props} onValueChange={handleOnValueChange}>
        <SelectTrigger className="my-auto w-[150px] rounded-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="rounded-b-xl">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {supportedTextFormats.map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
