import ChurchesMap from "./components/Home/ChurchesMap";
import Schedule2 from "./components/Home/Schedule2";
import BibleStudyBooking from "./components/Home/BibleStudyBooking";

export default function Home() {
    return (
        <main>
            {/* Hero Section with Background Image */}
            <div
                className="w-full relative bg-cover bg-center bg-no-repeat bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            >
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 mx-auto flex flex-col items-center xl:pt-32 xl:pb-36 pt-16 pb-24 xs:px-5 px-3 sm:px-10 md:px-16 lg:px-20 text-white">
                    <div className="w-11/12 sm:w-4/5 lg:w-3/4 pt-12 sm:pt-24">
                        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-center font-bold leading-tight drop-shadow-md">
                            Changing Lives <br />
                            Making Disciples
                            <br />
                            Reaching the World
                        </h1>
                    </div>
                </div>
            </div>

            <ChurchesMap />
            <Schedule2 />

            {/* Location Section with Subtle Background */}
            <div className="w-full bg-slate-50 py-16 mt-10 border-t border-b border-gray-200">
                <div className="px-12 mx-auto max-w-7xl">
                    <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 text-center">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">
                                Location
                            </h2>
                        </div>
                        <div className="shadow-lg rounded-xl overflow-hidden border border-gray-200">
                            <iframe
                                style={{
                                    border: "0",
                                    width: "100%",
                                    height: "350px",
                                }}
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.3606374644386!2d121.04508242923127!3d14.57384059731737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8458db5a0c7%3A0x76f79991d6f0502a!2sThe%20Potter&#39;s%20House%20Christian%20Center!5e0!3m2!1sen!2sph!4v1603335130891!5m2!1sen!2sph"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <BibleStudyBooking />
        </main>
    );
}
