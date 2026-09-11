import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const webhookUrl =
            process.env.NEXT_CONFERERENCE_NOV_2026_SHEETS_WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Missing Google Sheets webhook env var.",
                },
                { status: 500 },
            );
        }

        const upstream = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                form: "delegates",
                submitted_at: new Date().toISOString(),
                ...body,
            }),
            cache: "no-store",
        });

        const text = await upstream.text();

        if (!upstream.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    message: "Google Sheets webhook request failed.",
                    status: upstream.status,
                    response: text,
                },
                { status: 502 },
            );
        }

        return NextResponse.json({
            ok: true,
            response: text,
        });
    } catch (error) {
        console.error("Delegates webhook error:", error);

        return NextResponse.json(
            {
                ok: false,
                message: "Unable to submit application.",
            },
            { status: 500 },
        );
    }
}
