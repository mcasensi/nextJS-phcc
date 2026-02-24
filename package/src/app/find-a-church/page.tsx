import Image from "next/image";

export default function FindAChurch() {
    return (
        <section>
            <div className="overflow-hidden">
                <div className="container relative z-20 p-24">
                    <div className="relative z-20 grid lg:grid-cols-12 grid-cols-1 items-center lg:justify-items-normal justify-items-center gap-20 pb-10 pt-25">
                        <div className="lg:col-span-7 col-span-1">
                            <div className="flex flex-col items-center gap-12">
                                <h2 className="lg:text-start justify-center text-center max-w-lg">
                                    Find A Local Church
                                </h2>
                            </div>
                        </div>
                        {/* slider */}
                        <div className="lg:col-span-5 col-span-1 lg:w-[80%] sm:w-[80%] w-full align-right">
                            <div>
                                {/* <h4 htmlFor="location" className='mb-10'>Select your location to find a local church near you</h4> */}
                                <h4 className="mb-10 ">
                                    This service is temporarily unavailable due
                                    to maintenance.
                                </h4>
                                <select
                                    disabled
                                    className="w-full text-stone-400 outline-none bg-gray-400 text-white rounded-lg px-4 py-4"
                                >
                                    <option value="">Region</option>
                                    <option value="state1">State 1</option>
                                    <option value="state2">State 2</option>
                                    <option value="state3">State 3</option>
                                </select>
                                <select
                                    disabled
                                    className="w-full text-stone-400 outline-none bg-gray-400 text-white rounded-lg px-4 py-4 mt-3"
                                >
                                    <option value="">Province</option>
                                    <option value="state1">State 1</option>
                                    <option value="state2">State 2</option>
                                    <option value="state3">State 3</option>
                                </select>
                                <select
                                    disabled
                                    className="w-full text-stone-400 outline-none bg-gray-400 text-white rounded-lg px-4 py-4 mt-3"
                                >
                                    <option value="">Municipality/City</option>
                                    <option value="state1">State 1</option>
                                    <option value="state2">State 2</option>
                                    <option value="state3">State 3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* floting images */}
                    <div className="absolute top-16 -left-10  dark:opacity-10">
                        <Image
                            src={"/images/banner/pattern1.svg"}
                            alt="ptrn1"
                            width={141}
                            height={141}
                        />
                    </div>
                    <div className="absolute bottom-0 left-[53%] dark:opacity-10 z-10">
                        <Image
                            src={"/images/banner/pattern2.svg"}
                            alt="ptrn1"
                            width={141}
                            height={141}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
