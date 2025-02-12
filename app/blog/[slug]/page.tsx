import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";

export default async function Blog(props: { params: Promise<any> }) {
  const params = await props.params;
  const blog = allBlogs.find((blog) => blog.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
      </div>
      <div className="prose prose-lg">
      </div>
    </article>
  );
}

