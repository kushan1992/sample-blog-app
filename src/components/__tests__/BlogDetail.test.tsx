import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BlogDetail from '../BlogDetail'
import axios from 'axios'
import { vi } from 'vitest'
import type { Post } from '../../types/post'

vi.mock('axios')

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const mockPost: Post = {
  id: 1,
  title: 'Sample Post',
  body: 'This is the full body of the post.\nIt has multiple lines.',
  userId: 1,
}

const renderWithRouter = (id: string) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/post/${id}`]}>
        <Routes>
          <Route path="/post/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('BlogDetail', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders loading state', () => {
    vi.mocked(axios.get).mockImplementation(() => new Promise(() => {}))
    renderWithRouter('1')
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders error state', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Not found'))
    renderWithRouter('1')
    await waitFor(() => {
      expect(screen.getByText('Error fetching post')).toBeInTheDocument()
    })
  })

  test('fetches and renders blog detail', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockPost })
    renderWithRouter('1')

    await waitFor(() => {
      expect(screen.getByText('Sample Post')).toBeInTheDocument()
      expect(screen.getByText(/This is the full body/)).toBeInTheDocument()
    })
  })
})