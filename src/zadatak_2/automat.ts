import { writeFile } from "node:fs/promises";

type TokenResponse = {
  access_token?: string;
};

export async function getToken(
    authority: string,
    audience: string,
    clientId: string,
    clientSecret: string,
    scope: string
): Promise<string> {
    const res = await fetch(`${authority.replace(/\/+$/, "")}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            audience,
            scope,
        }),
    });

    if(!res.ok) {
        throw new Error(`Dohvat tokena nije uspio, status: ${res.status}`);
    }

    const json = await res.json();
    const data = json as TokenResponse;

    if(!data.access_token) {
        throw new Error("Odgovor ne sadrži access_token");
    }

    return data.access_token;

}

export async function issuePass(  
    url: string,
    token: string,
    name: string,
    document: string): Promise<void> {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, document }),
        });

        if (!res.ok) {
            throw new Error(`Izdavanje propusnice nije uspjelo, status: ${res.status}`);
        }

        const location = res.headers.get("Location");
        if(!location) {
            throw new Error("Odgovor ne sadrži zaglavlje Location");
        }

        const id = new URL(location, url).pathname.split("/").filter(Boolean).pop();
        if(!id) {
            throw new Error("Iz zaglavlja Location nije moguće dobiti identifikator");
        }

        const png = Buffer.from(await res.arrayBuffer());
        await writeFile(`${id}.png`, png);
}