import Image from "next/image";

const teamMembers = [
  {
    name: "Louka Ewington-Pitsos",
    title: "Chief Operating Officer",
    image: "/images/team_images/louka_ewington-pitsos.jpg",
  },
  {
    name: "Michael Reitzenstein",
    title: "Principle Data Scientist",
    image: "/images/team_images/michael_reitzenstein.jpg",
  },
  {
    name: "Victor Goh",
    title: "Research Scientist",
    image: "/images/team_images/goh.png",
  },
  {
    name: "Alan Huynh",
    title: "Machine Learning Engineer",
    image: "/images/team_images/alan_huynh.jpg",
  },
  {
    name: "Lucas Rose-Winters",
    title: "Backend Developer",
    image: "/images/team_images/lucas_rose-winters.jpg",
  },
];

export default function TeamSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-5 max-w-6xl mx-auto mb-12">
      {teamMembers.map((member) => (
        <div
          key={member.name}
          className="flex flex-col items-center bg-gray-100 p-4 rounded-lg transition-transform hover:translate-y-[-5px]"
        >
          <Image
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            width={180}
            height={180}
            className="rounded-full mb-4 border-4 border-white shadow-lg"
          />
          <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.title}</p>
        </div>
      ))}
    </div>
  );
}
