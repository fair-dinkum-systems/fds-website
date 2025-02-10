import Image from "next/image";
import Banner from "@/components/Banner";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900">
      <Banner />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 px-5 tracking-tight">
        Fair Dinkum Systems
      </h1>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal mb-12 px-5 text-gray-600">
        Revolutionizing Battery Life Prediction
      </h2>

      <div className="text-left px-5 w-full max-w-2xl mb-10">
        <p className="mb-4">
          The future of energy is electric, and batteries are at its heart:
        </p>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-5">
            Global battery demand has grown 33% annually for three decades, with
            electric vehicles and autonomous systems driving even stronger
            future growth
          </li>
          <li className="mb-5">
            Battery chemistry's complex, non-linear behavior makes it ideal for
            deep learning applications
          </li>
        </ol>
        <p className="mb-4">
          We're building the next generation of battery lifecycle management
          software. Our SaaS platform (in development) empowers manufacturers to
          precisely forecast battery Remaining Useful Life (RUL) and perform
          Impedance Matching using cutting-edge machine learning.
        </p>
        <p className="mb-4">
          Using a well known battery charging dataset our algorithm accurately
          predicts the RUL of LFP/graphite cells with just 15 charging cycles of
          data.
        </p>

        <div className="flex justify-center my-8">
          <Image
            src="/images/graph.png"
            alt="Performance Graph"
            width={480}
            height={480}
            className="rounded-lg shadow-lg"
          />
        </div>

        <p className="mb-4">
          What this means in practice: We can predict remaining battery life
          within 133 cycles using 85% less data than traditional approaches.
          This enables faster quality control, reduced testing costs, and more
          efficient battery development.
        </p>
        <p className="mb-4">
          We're now partnering with battery manufacturers to demonstrate these
          capabilities at commercial scale. Together, we're building a more
          sustainable and efficient energy future.
        </p>
      </div>

      <TeamSection />
      <ContactSection />
    </div>
  );
}
