"use client";

import { useRef, useState, type FormEvent } from "react";
import type { GuestKind } from "./rsvp";

type Row = { id: number; name: string; kind: GuestKind | "" };

export default function RsvpForm() {
  const [respondent, setRespondent] = useState("");
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState<Row[]>([{ id: 0, name: "", kind: "" }]);
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const nextRow = useRef(1);
  const lastRequest = useRef<{ id: string; body: string } | null>(null);

  function updateGuest(id: number, change: Partial<Row>) {
    setGuests((rows) => rows.map((row) => row.id === id ? { ...row, ...change } : row));
  }

  function addGuest() {
    const id = nextRow.current++;
    setGuests((rows) => [...rows, { id, name: "", kind: "" }]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer || status === "sending") return;
    const body = JSON.stringify({
      respondent: respondent.trim(),
      attending: answer === "yes",
      guests: answer === "yes" ? guests.map(({ name, kind }) => ({ name: name.trim(), kind })) : [],
    });
    if (lastRequest.current?.body !== body) lastRequest.current = { id: crypto.randomUUID(), body };
    setStatus("sending");
    try {
      const response = await fetch("/api/presenca", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Rsvp-Id": lastRequest.current.id },
        body,
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error("RSVP failed");
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  if (status === "saved") {
    return (
      <div className="rsvpSuccess" role="status">
        <span aria-hidden="true">✦</span>
        <h3>{answer === "yes" ? "Presença confirmada!" : "Resposta recebida!"}</h3>
        <p>{answer === "yes" ? "Até a festa da Lis!" : "Obrigada por avisar."}</p>
      </div>
    );
  }

  return (
    <form className="rsvpForm" onSubmit={submit}>
      <fieldset className="formFields" disabled={status === "sending"}>
        <fieldset className="rsvpChoice" aria-label="Confirmação de presença">
          <label>
            <input required type="radio" name="presence" checked={answer === "yes"} onChange={() => setAnswer("yes")} />
            <span className="choiceIcon" aria-hidden="true">★</span>
            <span>Vamos sim!</span>
          </label>
          <label>
            <input required type="radio" name="presence" checked={answer === "no"} onChange={() => setAnswer("no")} />
            <span>Não vamos conseguir ir</span>
          </label>
        </fieldset>
        {answer && (
          <label className="rsvpLabel">
            Seu nome
            <input required autoComplete="name" maxLength={100} value={respondent} onChange={(e) => setRespondent(e.target.value)} />
          </label>
        )}
        {answer === "yes" && (
          <fieldset className="rsvpGuests">
            <legend>Quem vai?</legend>
            <p>Escreva o nome de cada pessoa que vai, incluindo você se for à festa.</p>
            {guests.map((guest, index) => (
              <div className="guestRow" key={guest.id}>
                <label className="rsvpLabel">
                  Nome de quem vai
                  <input required maxLength={100} value={guest.name} onChange={(e) => updateGuest(guest.id, { name: e.target.value })} />
                </label>
                <label className="rsvpLabel">
                  Faixa etária
                  <select required value={guest.kind} onChange={(e) => updateGuest(guest.id, { kind: e.target.value as Row["kind"] })}>
                    <option value="" disabled>Selecione</option>
                    <option value="adulto">Adulto</option>
                    <option value="crianca">Criança</option>
                  </select>
                </label>
                {guests.length > 1 && (
                  <button className="removeGuest" type="button" aria-label={`Remover pessoa ${index + 1}`} onClick={() => setGuests((rows) => rows.filter((row) => row.id !== guest.id))}>×</button>
                )}
              </div>
            ))}
            {guests.length < 25 && <button className="addGuest" type="button" onClick={addGuest}>+ Adicionar pessoa</button>}
          </fieldset>
        )}
      </fieldset>
      {status === "error" && <p className="formError" role="alert">Não conseguimos enviar. Confira os nomes e tente de novo.</p>}
      {answer && (
        <button className="royalButton" disabled={status === "sending"} type="submit">
          {status === "sending" ? "Enviando…" : "Enviar resposta"}
        </button>
      )}
    </form>
  );
}
