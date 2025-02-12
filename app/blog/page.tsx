import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allBlogs } from "contentlayer/generated";

export default function BlogPage() {
  const posts = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <time dateTime={post.date} className="text-gray-600 mb-2 block">
                {format(parseISO(post.date), "LLLL d, yyyy")}
              </time>
              <p className="text-gray-700">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

