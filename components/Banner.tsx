import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full mb-12">
      <Image
        src="/images/fellows-cropped.JPG"
        alt="Banner Image"
        width={1920}
        height={1080}
        className="w-full object-cover"
      />
    </div>
  );
}
