import { Link } from 'react-router-dom'
import type { Post } from '../types/post'

interface BlogCardProps {
  post: Post
}

function BlogCard({ post }: BlogCardProps) {
  const shortDesc = post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
      <p className="text-gray-600 mb-4">{shortDesc}</p>
      <Link
        to={`/post/${post.id}`}
        className="inline-block text-blue-600 hover:text-blue-800 font-medium"
      >
        Read More →
      </Link>
    </div>
  )
}

export default BlogCard