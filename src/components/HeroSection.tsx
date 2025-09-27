import * as motion from "motion/react-client";
import Link from "./link";

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="element-center min-h-[calc(100vh-64px)]"
    >
      <div className="container text-center">
        <h1 className="text-3xl font-extrabold sm:text-5xl">
          All Your Digital Products
          <strong className="font-extrabold text-primary sm:block mt-5">
            Is One Click Away
          </strong>
        </h1>

        <p className="mt-4 sm:text-xl/relaxed">
          Start Exploring State of the Art Assets Now!
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            className="inline-block rounded bg-teal-500 hover:bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors "
            href="/get-started"
          >
            Get Started
          </Link>

          <Link
            className="inline-block rounded border border-primary px-5 py-3 font-medium text-primary shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            href="/about"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
