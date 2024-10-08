import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(
      {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      }
    )
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title <input type="text" value={blogTitle} name='blogTitle'  placeholder='Enter blog title' onChange={({ target }) => setBlogTitle(target.value)}/></div>
        <div>author <input type="text" value={blogAuthor} name='blogAuthor'  placeholder='Enter blog author'onChange={({ target }) => setBlogAuthor(target.value)}/></div>
        <div>url <input type="text" value={blogUrl} name='blogUrl' placeholder='Enter blog URL' onChange={({ target }) => setBlogUrl(target.value)}/></div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm