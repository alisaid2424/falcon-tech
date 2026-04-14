import SignInForm from "./SignInForm";
import Image from "next/image";

const SignInPage = () => {
  return (
    <section>
      <div className="lg:grid min-h-dvh lg:grid-cols-12">
        {/* Left Side (Image + Text) */}
        <section className="relative flex items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6 overflow-hidden">
          <Image
            alt="logo"
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            width={870}
            height={580}
          />

          <div className="hidden lg:relative lg:block lg:px-12 lg:pb-24">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              {/* Logo */}
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* (shortened for brevity) */}
              </svg>
            </a>

            <h2 className=" text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Squid 🦑
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>
          </div>
        </section>

        {/* Right Side (Sign In Form) */}
        <main className="relative flex items-center justify-center  lg:col-span-7 xl:col-span-6 overflow-hidden">
          <div className=" max-w-xl lg:max-w-3xl w-full">
            <div className="absolute inset-0 block lg:hidden z-0">
              <Image
                alt="Background"
                src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                fill
                className="object-cover opacity-80"
              />
            </div>

            <div className="relative z-10 w-full max-w-xl lg:max-w-3xl">
              <SignInForm />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignInPage;
