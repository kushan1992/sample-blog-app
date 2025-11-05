import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import BlogCard from './BlogCard'
import Pagination from './Pagination'
import type { Post } from '../types/post'

interface PostsResponse {
  data: Post[]
  total: number
}

const fetchPosts = async ({ queryKey }: { queryKey: [string, number, number] }): Promise<PostsResponse> => {
  const [, page, limit] = queryKey
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`)
  return {
    data: res.data,
    total: parseInt(res.headers['x-total-count'] || '100', 10),
  }
}

function BlogList() {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', currentPage, postsPerPage] as const,
    queryFn: fetchPosts,
  })

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center text-red-500 py-8">Error fetching posts</div>

  const posts = data?.data || []
  const totalPosts = data?.total || 0
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )
}

export default BlogList