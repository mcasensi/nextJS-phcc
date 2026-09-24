const conferenceSessions = [
    {
        title: "Understanding Today’s Child",
        speakers: ["Judy Asensi"],
        link: "https://canva.link/2kubjoon9mv8tj4",
    },
    {
        title: "Teaching that Changes Lives",
        speakers: ["Merbennyll Cruz"],
        link: "https://canva.link/jwb6z862gkjcn8e",
    },
    {
        title: "Building Safe Spaces",
        speakers: ["Liza Yema"],
        link: "https://canva.link/ffcmzoiyiwybzl9",
    },
    {
        title: "Maximizing Sunday School Resources",
        speakers: ["Marjorie Asensi"],
        link: "https://canva.link/tswfat9ykvpan0l",
    },
    {
        title: "The Heart of Sunday School\nMore than a Classroom - A Ministry that Changes Lives",
        speakers: ["Merbennyll Cruz", "Liza Yema", "Judy Asensi"],
        link: "",
    },
    {
        title: "Junior Church\nGrowing Young Disciples Through Meaningful Worship",
        speakers: ["EG Hernandez"],
        link: "",
    },
];

export default function ConferenceScheduleSection() {
    return (
        <section className="mt-8 w-full rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-sm sm:p-5">
            <div className="grid gap-4 lg:grid-cols-1">
                <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-4">
                    <h2 className="text-center text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[1.05] tracking-tight text-slate-900">
                        CHILDREN&apos;S WORKERS
                        <br />
                        CONFERENCE 2026
                    </h2>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <div className="min-w-[640px] overflow-hidden rounded-3xl border border-slate-300 bg-white">
                    <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-slate-300 bg-sky-200/90 text-center text-[0.7rem] font-black uppercase tracking-[0.12em] text-slate-800 sm:text-sm">
                        <div className="border-r border-slate-300 px-3 py-4">
                            Session Topic
                        </div>
                        <div className="border-r border-slate-300 px-3 py-4">
                            Speakers
                        </div>
                        <div className="px-3 py-4">Presentation Link</div>
                    </div>

                    {conferenceSessions.map((session) => (
                        <div
                            key={session.title}
                            className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-slate-300 last:border-b-0"
                        >
                            <div className="border-r border-slate-300 px-4 py-5 text-left text-sm font-bold text-slate-900 sm:text-base">
                                {session.title.split("\n").map((line, idx) => (
                                    <div
                                        key={`${session.title}-${idx}`}
                                        className={
                                            idx > 0
                                                ? "mt-2 leading-snug"
                                                : "leading-snug"
                                        }
                                    >
                                        {line}
                                    </div>
                                ))}
                            </div>

                            <div className="border-r border-slate-300 px-4 py-5 text-center text-sm font-medium text-slate-800 sm:text-base">
                                {session.speakers.map((speaker, idx) => (
                                    <div
                                        key={`${speaker}-${idx}`}
                                        className={idx > 0 ? "mt-1" : ""}
                                    >
                                        {speaker}
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-5 text-center text-sm text-slate-400 sm:text-base">
                                {session.link && (
                                    <a
                                        href={session.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        View Presentation
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
