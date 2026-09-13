const Home = () => {
    return (
        <div className="min-h-screen bg-amber-50">
            {/* Hero Section */}
            <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-20 md:flex-row md:py-28">
                
                {/* Hero Content */}
                <div className="flex-1">
                    <p className="mb-4 font-medium uppercase tracking-[0.3em] text-amber-700">
                        Freshly Brewed
                    </p>

                    <h1 className="text-5xl font-bold leading-tight text-stone-900 md:text-7xl">
                        Your perfect
                        <span className="block text-amber-700">
                            cup of coffee.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
                        Crafted with carefully selected beans, brewed with
                        passion, and served just the way you like it.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="rounded-full bg-stone-900 px-7 py-3 font-medium text-white transition hover:bg-stone-700">
                            Explore Menu
                        </button>

                        <button className="rounded-full border border-stone-300 px-7 py-3 font-medium text-stone-800 transition hover:bg-white">
                            Our Story
                        </button>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="flex-1">
                    <img
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                        alt="Coffee cup"
                        className="h-[450px] w-full rounded-3xl object-cover shadow-xl"
                    />
                </div>
            </section>

            {/* Features */}
            <section className="bg-white px-6 py-16">
                <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                    
                    <div className="rounded-2xl bg-amber-50 p-8">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Premium Beans
                        </h3>
                        <p className="mt-3 text-stone-600">
                            Carefully selected beans roasted for a rich,
                            balanced flavor.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-8">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Freshly Prepared
                        </h3>
                        <p className="mt-3 text-stone-600">
                            Every order is prepared fresh when you place it.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-8">
                        <h3 className="text-xl font-semibold text-stone-900">
                            Fast Delivery
                        </h3>
                        <p className="mt-3 text-stone-600">
                            Get your favorite coffee delivered straight to
                            your door.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;