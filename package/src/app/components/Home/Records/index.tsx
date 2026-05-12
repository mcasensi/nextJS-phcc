"use client";

import { RecordData } from "@/data/siteData";

const Records = () => {
  return (
    <section>
      <div className="container pt-24">
        <div className="text-center mb-8">
          <h2 className="mb-6">OUR STAFF</h2>
          <p className="text-lg font-normal max-w-2xl mx-auto">
            Our team crafts creative strategies that elevate your brand, engage your audience, and drive results.
          </p>
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-center gap-6">
          {RecordData.map((item, i) => (
            <div key={i}>
              <div className="border border-darkblue/10 dark:border-white/10 rounded-lg flex flex-col gap-4 items-center justify-center px-4 py-8 shadow dark:shadow-white/10">
                <div className="p-2 bg-primary rounded-full w-fit">
                  <img src={item.imgSrc} alt={item.imgSrc} width={32} height={32} />
                </div>
                <h5 className="text-center">{item.name}</h5>
                <p className="text-center text-base font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Records;
