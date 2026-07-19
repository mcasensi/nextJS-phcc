type AwardItem = {
    title: string;
    description: string;
    icon: string;
};

const awards: AwardItem[] = [
    {
        title: "Active Kid",
        description:
            "Given to a child who participates consistently and stays engaged in activities.",
        icon: "🏅",
    },
    {
        title: "Faithful Kid",
        description:
            "Awarded to a child with consistent attendance and commitment to Sunday School.",
        icon: "🥇",
    },
    {
        title: "Enthusiastic Kid",
        description:
            "Recognizes a child who shows joy, excitement, and positive energy in class.",
        icon: "🏅",
    },
    {
        title: "Helpful Kid",
        description:
            "Given to a child who willingly helps teachers and classmates with a kind heart.",
        icon: "🎖️",
    },
    {
        title: "Most Improved Kid",
        description:
            "Awarded to a child who has shown clear growth in behavior, participation, or learning.",
        icon: "🏅",
    },
    {
        title: "Best in Memory Verse / Good in Memory Verse",
        description:
            "Recognizes a child who excels in memorizing and reciting Bible verses.",
        icon: "🥇",
    },
    {
        title: "Friendly Kid",
        description:
            "Given to a child who is welcoming, kind, and builds good friendships with others.",
        icon: "🏅",
    },
    {
        title: "Creative Kid",
        description:
            "Awarded to a child who shows creativity in activities, crafts, and class participation.",
        icon: "🎖️",
    },
    {
        title: "Outstanding Kid",
        description:
            "Recognizes exceptional all-around performance in character, learning, and involvement.",
        icon: "🥇",
    },
    {
        title: "Highest Pointer",
        description:
            "Given to the child with the highest points based on class performance and participation.",
        icon: "🏆",
    },
];

export default function AwardsPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mt-20">
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 sm:p-8 shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    Sunday School Awards
                </h1>
                <p className="mt-2 text-slate-600 max-w-3xl">
                    Celebrate and encourage every child through meaningful award
                    badges that recognize character, growth, and participation.
                </p>
            </section>

            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-semibold text-amber-900">
                    Reminder
                </h2>
                <p className="mt-2 text-sm sm:text-base text-amber-900/90">
                    Children who will receive any award should be evaluated not
                    only on their performance but also on their character and
                    spiritual growth. Award recipients should be positive role
                    models who demonstrate Christ-like attitudes and set a good
                    example for the other children.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    List of Awards
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {awards.map((award) => (
                        <article
                            key={award.title}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl"
                                    aria-hidden="true"
                                >
                                    {award.icon}
                                </span>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {award.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {award.description}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">
                    Certification
                </h2>
                <p className="mt-2 text-slate-700">
                    Use this Canva template for creating Sunday School award
                    certificates.
                </p>

                <a
                    href="https://canva.link/hgxwvcylek1kbeo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                    Open Canva Certificate Template
                </a>
            </section>
        </main>
    );
}
