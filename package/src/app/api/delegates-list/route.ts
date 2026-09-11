import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const webhookUrl =
        process.env.NEXT_CONFERERENCE_NOV_2026_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
        return NextResponse.json(
            {
                ok: false,
                message:
                    "NEXT_CONFERERENCE_NOV_2026_SHEETS_WEBHOOK_URL is not configured.",
            },
            { status: 500 },
        );
    }

    try {
        const upstream = await fetch(webhookUrl, {
            method: "GET",
            redirect: "follow",
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        const text = await upstream.text();

        if (!upstream.ok) {
            console.error("Google Sheets response:", upstream.status, text);

            return NextResponse.json(
                {
                    ok: false,
                    message: `Google Sheets webhook returned HTTP ${upstream.status}.`,
                },
                { status: 502 },
            );
        }

        let data: unknown;

        try {
            data = JSON.parse(text);
        } catch {
            console.error("Webhook did not return JSON:", text);

            return NextResponse.json(
                {
                    ok: false,
                    message:
                        "Google Sheets webhook did not return valid JSON. Check the Apps Script deployment.",
                },
                { status: 502 },
            );
        }

        const rows = Array.isArray(data)
            ? data
            : typeof data === "object" &&
                data !== null &&
                "data" in data &&
                Array.isArray(data.data)
              ? data.data
              : [];

        return NextResponse.json({
            ok: true,
            data: rows,
        });
    } catch (error) {
        console.error("Delegates list error:", error);

        return NextResponse.json(
            {
                ok: false,
                message: "Unable to connect to the Google Sheets webhook.",
            },
            { status: 502 },
        );
    }
}
