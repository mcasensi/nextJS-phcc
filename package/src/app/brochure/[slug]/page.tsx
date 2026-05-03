function Brochure({ params }: { params: { slug: string } }) {
    const brochures: { [key: string]: { file: string; label: string } } = {
        "122023": {
            file: "/images/brochure/122023.pdf",
            label: "December 2023",
        },
        "052024": {
            file: "/images/brochure/052024.pdf",
            label: "May 2024",
        },
        "112024": {
            file: "/images/brochure/112024.pdf",
            label: "November 2024",
        },
        "052025": {
            file: "/images/brochure/052025.pdf",
            label: "May 2025",
        },
        "112025": {
            file: "/images/brochure/calledToBuild2025.jpg",
            label: "November 2025",
        },
        "052026": {
            file: "/images/brochure/052026.png",
            label: "May 2026",
        },
    };

    const brochure = brochures[params.slug];

    if (!brochure) {
        return (
            <section className="hero container max-w-screen-lg mx-auto mt-15">
                <p className="text-center">brochure not found.</p>
            </section>
        );
    }

    const isPdf = brochure.file.toLowerCase().endsWith(".pdf");

    return (
        <section className="hero container max-w-screen-lg mx-auto mt-25">
            <h1 className="text-3xl font-bold mb-4">
                {brochure.label} Brochure
            </h1>

            {isPdf ? (
                <object
                    data={brochure.file}
                    type="application/pdf"
                    className="w-full border"
                    style={{ height: "90vh" }}
                    aria-label={`${brochure.label} Brochure PDF`}
                >
                    <p className="text-center">
                        PDF preview not available.{" "}
                        <a
                            href={brochure.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Open brochure
                        </a>
                    </p>
                </object>
            ) : (
                <img
                    src={brochure.file}
                    alt={`${brochure.label} Brochure`}
                    className="w-full h-auto border"
                />
            )}
        </section>
    );
}

export default Brochure;
