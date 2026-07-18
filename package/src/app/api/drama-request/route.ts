import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            video_reference_link,
            sffx_link,
            genres,
            download_link,
        } = body ?? {};

        if (
            !title ||
            !video_reference_link ||
            !sffx_link ||
            !genres ||
            !download_link
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const webhook = process.env.DISCORD_DRAMA_REQUEST_WEBHOOK;
        if (!webhook) {
            return NextResponse.json(
                { error: "Webhook not configured" },
                { status: 500 },
            );
        }

        const payload = {
            content: "🎭 New Drama Script Entry Request",
            embeds: [
                {
                    title: String(title),
                    color: 3447003,
                    fields: [
                        {
                            name: "Video Reference Link",
                            value: String(video_reference_link),
                        },
                        { name: "SFFX Link", value: String(sffx_link) },
                        { name: "Genres", value: String(genres) },
                        { name: "Download Link", value: String(download_link) },
                    ],
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        const r = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!r.ok) {
            const text = await r.text();
            return NextResponse.json(
                { error: `Discord error: ${text}` },
                { status: 502 },
            );
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
