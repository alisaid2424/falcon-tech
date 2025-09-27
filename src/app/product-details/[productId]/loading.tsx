const SingleProductLoading = () => {
  return (
    <div className="container py-8 animate-pulse max-w-7xl mx-auto">
      <h2 className="w-56 h-10 bg-slate-200 rounded-lg"></h2>
      <div className=" mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 justify-around">
        <div className="w-[400px] h-[300px] bg-slate-200 rounded-lg"></div>
        <div>
          <h2 className="w-56 h-7 bg-slate-200"></h2>
          <h3 className="w-14 h-6 bg-slate-200 mt-2 "></h3>
          <p className="w-full h-4 bg-slate-200 mt-3"></p>
          <p className="w-full h-4 bg-slate-200 mt-3"></p>
          <p className="w-full h-3 bg-slate-200 my-4"></p>
          <p className="w-full h-2 bg-slate-200"></p>
          <h4 className="w-20 h-10 bg-slate-200 mt-3"></h4>
          <div className="w-36 h-12 mt-5 bg-slate-200 rounded-lg"></div>
        </div>
      </div>

      <h2 className="w-56 h-7 bg-slate-200 rounded-lg mt-24 mb-8"></h2>
    </div>
  );
};

export default SingleProductLoading;
