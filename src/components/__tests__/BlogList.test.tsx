import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import BlogList from '../BlogList'
import axios from 'axios'
import { vi } from 'vitest'
import type { Post } from '../../types/post'

vi.mock('axios')

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const mockPosts: Post[] = [
  { id: 1, title: 'First Post', body: 'This is a long body text for testing truncation and rendering...', userId: 1 },
  { id: 2, title: 'Second Post', body: 'Short body.', userId: 1 },
]

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('BlogList', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders loading state', () => {
    vi.mocked(axios.get).mockImplementation(() => new Promise(() => {})) // never resolves
    renderWithProviders(<BlogList />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders error state', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))
    renderWithProviders(<BlogList />)
    await waitFor(() => {
      expect(screen.getByText('Error fetching posts')).toBeInTheDocument()
    })
  })

  test('fetches and renders blog list', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: mockPosts,
      headers: { 'x-total-count': '2' },
    })

    renderWithProviders(<BlogList />)

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument()
      expect(screen.getByText('Second Post')).toBeInTheDocument()
    })
  })
})