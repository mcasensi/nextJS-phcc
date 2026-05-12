"use client";

import { SpecializeData } from "@/data/siteData";

const Specialize = () => {
  return (
    <section id="expertise" className="scroll-mt-12 pt-35">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="mb-6">OUR VISIONS</h2>
          <p className="text-lg font-normal max-w-2xl mx-auto">
            Our team crafts creative strategies that elevate your brand, engage your audience, and drive results.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {SpecializeData.map((item, i) => (
            <div key={i}>
              <div className="bg-secondary dark:bg-darklight rounded-lg p-8">
                <div>
                  <h5 className="font-bold mb-2">{item.title}</h5>
                  <p className="text-base font-normal max-w-xs">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialize;
