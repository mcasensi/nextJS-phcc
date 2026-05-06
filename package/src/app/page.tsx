import Schedule2 from './components/Home/Schedule2'

export default function Home() {
  return (
    <main>
      <div className="w-full">
        <div className="relative  mx-auto flex flex-col items-center xl:pt-20 xl:pb-24 pt-10 pb-16 xs:px-5 px-3 sm:px-10 md:px-16 lg:px-20">
              <div className="w-11/12 sm:w-2/3 pt-24">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center font-bold leading-tight">
                      Changing Lives <br/>
                      Making Disciples<br/>
                      Reaching the World
                  </h1>
              </div>
          </div>
      </div>
      <Schedule2 />
      <div className="px-12 mx-auto max-w-7xl mt-10">
        <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 text-center">
            <div className='text-center mb-8'>
              <h2>Location</h2>
            </div>
            <iframe style={{border:'0', width: '100%', height: '270px'}} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.3606374644386!2d121.04508242923127!3d14.57384059731737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8458db5a0c7%3A0x76f79991d6f0502a!2sThe%20Potter&#39;s%20House%20Christian%20Center!5e0!3m2!1sen!2sph!4v1603335130891!5m2!1sen!2sph" frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    </main>
  );
}
