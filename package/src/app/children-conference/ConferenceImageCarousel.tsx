"use client";

import { useEffect, useState } from "react";

const imageNumbers = [
    6753, 6754, 6755, 6756, 6757, 6758, 6759, 6760, 6761, 6762, 6763, 6764,
    6765, 6766, 6767, 6768, 6769, 6771, 6772, 6773,
];

const images = imageNumbers.map(
    (number) =>
        `https://pottershousephils.s3.ap-southeast-2.amazonaws.com/sunday-school/children-conference/2026/images/IMG_${number}.HEIC`,
);

export default function ConferenceImageCarousel() {
    const [index, setIndex] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let objectUrl: string | null = null;

        setPreviewUrl(null);
        setError(null);

        async function convertImage() {
            try {
                const response = await fetch(images[index]);
                if (!response.ok)
                    throw new Error("Could not load image from S3.");

                const { default: heic2any } = await import("heic2any");
                const result = await heic2any({
                    blob: await response.blob(),
                    toType: "image/jpeg",
                    quality: 0.85,
                });
                const jpegBlob = Array.isArray(result) ? result[0] : result;

                if (!cancelled) {
                    objectUrl = URL.createObjectURL(jpegBlob);
                    setPreviewUrl(objectUrl);
                }
            } catch (cause) {
                console.error("Carousel image load/conversion failed:", cause);
                if (!cancelled) {
                    setError(
                        cause instanceof Error
                            ? `Image failed: ${cause.message}`
                            : "Image failed to load or convert.",
                    );
                }
            }
        }

        void convertImage();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [index]);

    const move = (step: number) =>
        setIndex((current) => (current + step + images.length) % images.length);

    return (
        <section
            aria-label="Children's conference photos"
            className="mx-auto w-full max-w-4xl"
        >
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`Children's conference photo ${index + 1} of ${images.length}`}
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <p role={error ? "alert" : undefined}>
                        {error ?? "Loading image…"}
                    </p>
                )}
            </div>
            <div className="mt-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => move(-1)}
                    className="rounded-lg border px-4 py-2"
                >
                    Previous
                </button>
                <span aria-live="polite">
                    {index + 1} / {images.length}
                </span>
                <button
                    type="button"
                    onClick={() => move(1)}
                    className="rounded-lg border px-4 py-2"
                >
                    Next
                </button>
            </div>
        </section>
    );
}
