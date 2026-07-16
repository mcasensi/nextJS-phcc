import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, mobile, address, day, time } = await req.json();

        if (!name || !mobile || !address || !day || !time) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            return NextResponse.json(
                { error: "Webhook not configured" },
                { status: 500 },
            );
        }

        const payload = {
            content: "📖 New Bible Study Booking",
            embeds: [
                {
                    title: "Bible Study Request",
                    color: 3447003,
                    fields: [
                        { name: "Name", value: String(name), inline: true },
                        { name: "Mobile", value: String(mobile), inline: true },
                        { name: "Day", value: String(day), inline: true },
                        { name: "Time", value: String(time), inline: true },
                        {
                            name: "Address",
                            value: String(address),
                            inline: false,
                        },
                    ],
                    timestamp: new Date().toISOString(),
                },
            ],
        };

        const discordRes = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!discordRes.ok) {
            const text = await discordRes.text();
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
