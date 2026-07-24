"use client";
const resources = [
    {
        title: "Awards",
        description:
            "Certificates, recognition templates, and milestone rewards for kids.",
        link: "https://pottershousephils.com/sunday-school/awards",
        buttonLabel: "View Awards",
        color: "bg-amber-50 border-amber-200",
    },
    {
        title: "Curriculum",
        description:
            "Age-appropriate lesson plans and teaching outlines for all age groups.",
        link: "https://pottershousephils.com/curriculum",
        buttonLabel: "View Curriculum",
        color: "bg-blue-50 border-blue-200",
    },
    {
        title: "VBS",
        description:
            "Vacation Bible School guides, activities, themes, and program resources.",
        link: "https://pottershousephils.com/curriculum/vbs",
        buttonLabel: "View VBS",
        color: "bg-emerald-50 border-emerald-200",
    },
    {
        title: "Bible Story Book",
        description:
            "Story-based Bible materials for children with easy-to-follow narratives.",
        link: "https://pottershousephils.com/sunday-school/bible-story",
        buttonLabel: "View Story Books",
        color: "bg-purple-50 border-purple-200",
    },
];

export default function SundaySchoolPage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mt-20">
            <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 sm:p-8 shadow-sm">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    Sunday School for Kids
                </h1>
                <p className="mt-2 text-slate-600 max-w-2xl">
                    Resources for children of all ages to support learning,
                    faith, and fun in every Sunday School class.
                </p>
            </section>

            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    Resources
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resources.map((item) => (
                        <article
                            key={item.title}
                            className={`rounded-xl border p-5 shadow-sm ${item.color}`}
                        >
                            <h3 className="text-lg font-semibold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600 min-h-[72px]">
                                {item.description}
                            </p>
                            <a
                                href={item.link}
                                className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
                            >
                                {item.buttonLabel}
                            </a>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
