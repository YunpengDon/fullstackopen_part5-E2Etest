const loginWith = async (page, username, password) => {
  await page.getByTestId(/username/i).fill(username)
  await page.getByTestId(/password/i).fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', {name: 'create new blog'}).click()
  await page.getByPlaceholder('Enter blog title').fill(content.title)
  await page.getByPlaceholder('Enter blog author').fill(content.author)
  await page.getByPlaceholder('Enter blog URL').fill(content.url)
  await page.getByRole('button', {name: 'create'}).click()
}

export { loginWith, createBlog }