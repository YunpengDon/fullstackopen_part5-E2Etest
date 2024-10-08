import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event/dist/cjs/setup/index.js'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created.', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  }

  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)
  const inputBlogTitle = screen.getByPlaceholderText('Enter blog title')
  const inputBlogAuthor = screen.getByPlaceholderText('Enter blog author')
  const inputBlogUrl = screen.getByPlaceholderText('Enter blog URL')
  const sendButton = screen.getByText('create')

  await user.type(inputBlogTitle, newBlog.title)
  await user.type(inputBlogAuthor, newBlog.author)
  await user.type(inputBlogUrl, newBlog.url)
  await user.click(sendButton)

  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(newBlog)
}
)
