import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Post } from '../types/post'

const fetchPost = async ({ queryKey }: { queryKey: [string, string] }): Promise<Post> => {
  const [, id] = queryKey
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
  return res.data
}

function BlogDetail() {
  const { id } = useParams<{ id: string }>()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id!] as const,
    queryFn: fetchPost,
    enabled: !!id,
  })

  if (isLoading) return <div className="text-center py-12">Loading...</div>
  if (error) return <div className="text-center text-red-500 py-12">Error fetching post</div>
  if (!post) return <div className="text-center py-12">Post not found</div>

  return (
    <article className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>
      <div className="prose prose-lg max-w-none text-gray-700">
        {post.body.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </article>
  )
}

export default BlogDetail