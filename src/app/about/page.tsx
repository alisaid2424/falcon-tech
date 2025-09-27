import Image from "next/image";

const AboutPage = () => {
  const stats = [
    {
      data: "35K",
      title: "Customers",
    },
    {
      data: "10K+",
      title: "Downloads",
    },
    {
      data: "40+",
      title: "Countries",
    },
    {
      data: "30M+",
      title: "Total revenue",
    },
  ];

  return (
    <section className="py-14 min-h-[calc(100vh-80px)] flex items-center justify-center max-w-7xl mx-auto">
      <div className="container text-foreground gap-12 items-center justify-between lg:flex">
        <div className="flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="rounded-lg"
            alt="img-about"
            width={500}
            height={500}
          />
        </div>
        <div className="mt-6 gap-12  flex flex-col text-center lg:text-start lg:block">
          <div className="max-w-2xl mx-0">
            <h3 className="text-foreground text-3xl font-semibold sm:text-4xl">
              We do our best to make customers always happy
            </h3>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-center lg:mx-0 lg:text-start">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              venenatis sollicitudin quam ut tincidunt.
            </p>
          </div>
          <div className="flex-none mt-6 md:mt-0">
            <ul className="inline-grid gap-y-8 gap-x-14 grid-cols-2">
              {stats.map((item, idx) => (
                <li key={idx} className="">
                  <h4 className="text-4xl text-primary font-semibold">
                    {item.data}
                  </h4>
                  <p className="mt-3 font-medium">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
