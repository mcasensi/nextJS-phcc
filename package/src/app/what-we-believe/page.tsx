export default function WhatWeBelieve() {
    const statements = [
        "There is only one God, and that He is eternally existent in Three Persons: Father, Son, and Holy Spirit.",
        "God the Father is the Creator of the universe. He created man in His own image for fellowship, and called man back to Himself through Christ after the rebellion and fall of man.",
        "Jesus Christ is eternally God. He was together with the Father and the Holy Spirit from the beginning, and through Him all things were made. He left Heaven and became incarnate by the Holy Spirit of the Virgin Mary; henceforth, He is forever one Christ with two natures--God and man--in one Person.",
        "The Holy Spirit is God, the Lord, and giver of life, who was active in the Old Testament, and given to the Church in fullness at Pentecost. He empowers the saints for service and witness, cleanses man from the old nature, and conforms us to the image of Christ.",
        "The baptism in the Holy Spirit with evidence of speaking in tongues, subsequent to conversion, releases the fullness of the Spirit, and is evidenced by the fruits and gifts of the Holy Spirit.",
        "In the Bible containing the Old and New Testament is alone the only infallible, inspired Word of God, and that its authority is ultimate, final, and eternal. It cannot be added to, subtracted from, or superseded in any regard. The Bible is the source of all doctrine, instruction, correction, and reproof. It contains all that is needed for guidance in godliness and practical Christian conduct.",
        "Christ's vicarious death on the cross paid the penalty for the sins of the whole world. Its benefits of healing (body, soul, and spirit) are provided for in the atonement as well.",
        "That salvation is a free gift of God, based on the merits of the death of His Son, and is appropriated by faith. Salvation is affected by person repentance, belief in the Lord Jesus (justification), and personal acceptance of Him into one's life as Lord and Savior (regeneration).",
        "The Christian life is to be one of consecration, devotion, and holiness. The shortcomings of the individual are because of the still progressing sanctification of the saints. The Christian life is filled with trials, tests, and warfare against a spiritual enemy. For those abiding in Christ until their deaths or His return, the promises of eternal blessing in the presence of God are assured.",
        "The Church is the Body of Christ, the habitation of God among the saints through the Spirit. Every believer born of the Spirit has a place in the church designated by God. A place where Christ is working in the lives of the called out ones and calling ministers to the great commission to go into all the world and make disciples of every nation.",
        "In the ordinances of Baptism and the Lord's Supper. Baptism is the outward sign of what God has already done in the individual's life and is a public testimony that the person now belongs to Christ. It is identifying with the death and resurrection of Jesus and is done in the name of the Father, the Son, and the Holy Spirit. The Lord's Supper is a commemoration of the death of the Lord and is done in remembrance of Him until He comes again; it is a sign of our participation in Him.",
        "In the bodily, personal, second coming of the Lord Jesus Christ, the resurrection of the saints, the millennium, and the final judgment. The final judgment will determine the eternal status of both the saints and the unbelievers, determined by their relationship to Jesus Christ.",
    ];

    return (
        <section>
            <div className="container pt-10">
                <main className="mx-auto max-w-5xl px-6 py-12">
                    <h1 className="mb-8 text-3xl font-bold">
                        Statement of Faith for The Potter&apos;s House
                    </h1>

                    <ul className="space-y-6 list-disc pl-6">
                        {statements.map((statement, index) => (
                            <li key={index} className="leading-7">
                                {statement}
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </section>
    );
}
