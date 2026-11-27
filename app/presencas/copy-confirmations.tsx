"use client";

import { useState } from "react";

export default function CopyConfirmations({ value }: { value: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }

  return (
    <div className="copyConfirmations">
      <button className="addGuest" type="button" onClick={copy}>Copiar confirmações</button>
      <span role="status">
        {status === "copied" && "Confirmações copiadas."}
        {status === "manual" && "Selecione e copie a lista abaixo."}
      </span>
      {status === "manual" && (
        <textarea aria-label="Lista de confirmações" readOnly value={value} rows={7}
          onFocus={(event) => event.currentTarget.select()} />
      )}
    </div>
  );
}
