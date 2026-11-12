import { cookies } from "next/headers";
import { confirmedGuests, listRsvps, type Rsvp } from "../rsvp";
import { cookieName, validSession } from "./session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Presenças · Reino da Lis", robots: { index: false, follow: false } };

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const authorized = validSession((await cookies()).get(cookieName)?.value);
  if (!authorized) {
    const { erro } = await searchParams;
    return (
      <main className="royalPage gatePage">
        <section className="royalCard gateCard">
          <p className="royalKicker">O REINO DA PRINCESA LIS</p>
          <h1>Painel de presenças</h1>
          <form className="rsvpForm" action="/presencas/sessao" method="post">
            <label className="rsvpLabel">Senha do painel<input type="password" autoComplete="current-password" name="password" required maxLength={128} /></label>
            {erro && <p role="alert" className="formError">Senha incorreta.</p>}
            <button className="royalButton" type="submit">Entrar</button>
          </form>
        </section>
      </main>
    );
  }

  let responses: Rsvp[] | null = null;
  try {
    responses = (await listRsvps()).map((response) => ({ ...response, guests: confirmedGuests(response) }));
  } catch {
    // A failed fetch is shown separately from an empty guest list.
  }

  const guests = responses?.flatMap((response) => response.guests) ?? [];
  const adults = guests.filter((guest) => guest.kind === "adulto").length;
  const declines = responses?.filter((response) => !response.attending).length ?? 0;

  return (
    <main className="royalPage dashboardPage">
      <section className="royalCard dashboardCard">
        <header className="dashboardHeader">
          <div><p className="royalKicker">O REINO DA PRINCESA LIS</p><h1>Painel de presenças</h1></div>
          <form action="/presencas/sessao" method="post">
            <button className="addGuest" type="submit" name="logout" value="yes">Sair</button>
          </form>
        </header>
        {responses === null ? <p role="alert">Não foi possível carregar as respostas. Atualize a página para tentar de novo.</p> : (
          <>
            <dl className="rsvpTotals">
              <div><dt>Adultos confirmados</dt><dd>{adults}</dd></div>
              <div><dt>Crianças confirmadas</dt><dd>{guests.length - adults}</dd></div>
              <div><dt>Respostas de ausência</dt><dd>{declines}</dd></div>
            </dl>
            {responses.length === 0 && <p>Ainda não chegou nenhuma resposta.</p>}
            <div className="responseList">
              {responses.map((response, index) => (
                <article key={response.submittedAt + index}>
                  <h2>{response.respondent}</h2>
                  {response.attending ? (
                    <ul>
                      {response.guests.map((guest, guestIndex) => (
                        <li key={guestIndex}>{guest.name} <span>· {guest.kind === "adulto" ? "Adulto" : "Criança"}</span></li>
                      ))}
                    </ul>
                  ) : <p>Não vai à festa</p>}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
