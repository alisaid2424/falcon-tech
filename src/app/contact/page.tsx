import Image from "next/image";

const ContactUsPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Image Section */}
      <div className="flex-1 hidden lg:block relative w-full h-dvh">
        <Image
          src="https://images.unsplash.com/photo-1697135807547-5fa9fd22d9ec?auto=format&fit=crop&q=80&w=1080"
          alt="Contact background"
          fill
          unoptimized
          className="object-cover h-full"
        />
      </div>

      {/* Contact Form Section */}
      <div className="py-12 flex-1 lg:flex lg:justify-center h-full">
        <div className="max-w-lg flex-1 mx-auto px-4 text-gray-600">
          <div className="text-center lg:text-start">
            <h3 className="text-foreground text-3xl font-semibold sm:text-4xl uppercase">
              Get in touch
            </h3>
            <p className="mt-3 text-muted-foreground">
              We’d love to hear from you! Please fill out the form below.
            </p>
          </div>

          <form className="space-y-5 mt-10 lg:pb-12">
            <div>
              <label htmlFor="fullName" className="font-medium">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="off"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="phone" className="font-medium">
                Phone number
              </label>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                  <select className="text-sm bg-transparent outline-none rounded-lg h-full">
                    <option>US</option>
                    <option>ES</option>
                    <option>MR</option>
                  </select>
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-000"
                  required
                  className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="font-medium">
                Message
              </label>
              <textarea
                id="message"
                required
                className="w-full mt-2 h-10 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-lg duration-150"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactUsPage;
