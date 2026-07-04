import type React from "react";
import { Label } from "#ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#ui/select";
import { TextFormats } from "@/lib/text-formats";

export default function TextFormatSelect({
  label,
  supportedFormats,
  ...props
}: {
  label: string;
  supportedFormats: string[];
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

  return (
    <div className="flex gap-2">
      <Label>{label}</Label>
      <Select {...props}>
        <SelectTrigger className="my-auto w-37.5 rounded-full">
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
