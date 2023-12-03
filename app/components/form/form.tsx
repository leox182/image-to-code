"use client";
import { FormEvent } from "react";
import InputBlock from "@ui/input-block/input-block";
import Button from "@ui/button/button";

export default function Form({ transformUrlToCode }: { transformUrlToCode: (url: string) => void }) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    const url = formEl.elements.namedItem("url") as HTMLInputElement;

    transformUrlToCode(url.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <InputBlock className="flex-1" label="Or paste an image URL" name="url" type="url" placeholder="https://your-screenshot/image.jpg" />
      <Button>Generate code</Button>
    </form>
  );
}
