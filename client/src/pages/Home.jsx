import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-20 md:flex-row md:py-28">
        {/* Hero Content */}
        <div className="flex-1 text-center md:text-left">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-700 sm:text-base sm:tracking-[0.3em]">
            Freshly Brewed
          </p>

          <h1 className="text-4xl font-bold leading-tight text-stone-900 sm:text-5xl md:text-7xl">
            Your perfect
            <span className="block text-amber-700">cup of coffee.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600 sm:mt-6 sm:text-lg sm:leading-8 md:mx-0">
            Crafted with carefully selected beans, brewed with passion, and
            served just the way you like it.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center md:justify-start">
            <Link
              to="/menu"
              className="w-full rounded-full bg-stone-900 px-7 py-3 text-center font-medium text-white transition hover:bg-stone-700 sm:w-auto"
            >
              Explore Menu
            </Link>

            <button className="w-full rounded-full border border-stone-300 px-7 py-3 font-medium text-stone-800 transition hover:bg-white sm:w-auto">
              Our Story
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full flex-1">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            alt="Coffee cup"
            className="h-[300px] w-full rounded-3xl object-cover shadow-xl sm:h-[400px] md:h-[450px]"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-amber-50 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-stone-900">
              Premium Beans
            </h3>

            <p className="mt-3 leading-7 text-stone-600">
              Carefully selected beans roasted for a rich, balanced flavor.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-stone-900">
              Freshly Prepared
            </h3>

            <p className="mt-3 leading-7 text-stone-600">
              Every order is prepared fresh when you place it.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-stone-900">
              Fast Delivery
            </h3>

            <p className="mt-3 leading-7 text-stone-600">
              Get your favorite coffee delivered straight to your door.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
