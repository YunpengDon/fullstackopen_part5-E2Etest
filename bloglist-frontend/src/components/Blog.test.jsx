import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'

// eslint-disable-next-line no-undef
describe('<Blog /> render in default', () => {
  let container
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
    user: {
      username: 'hellas',
      name: 'Arto Hellas',
      id: '66fd3fd703259e7e1138191e'
    },
    id: '66fe2df19d7607b1a022ed8e'
  }
  beforeEach(() => {
    container = render(
      <Blog blog={blog}/>
    ).container
  })

  test('the blog\'s title is rendered', () => {
    const element = screen.getByText('Go To Statement Considered Harmful', { exact: false })
    expect(element).toBeDefined()
  })

  test('the blog\'s author is rendered', () => {
    const element = screen.getByText('Edsger W. Dijkstra', { exact: false })
    expect(element).toBeDefined()
  })

  test('the blog\'s URL or number of likes are not rendered by default', () => {
    const div = container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })


})

describe('<Blog/> button operations', () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6,
    user: {
      username: 'hellas',
      name: 'Arto Hellas',
      id: '66fd3fd703259e7e1138191e'
    },
    id: '66fe2df19d7607b1a022ed8e'
  }

  test(' the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async() => {
    const { container } = render(
      <Blog blog={blog}/>
    )
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.blogDetails')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
    const mockHandler = vi.fn()
    const { container } = render(
      <Blog blog={blog} changeBlog={mockHandler}/>
    )
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})