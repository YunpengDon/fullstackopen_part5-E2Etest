const {test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Testor 1',
        username: 'testor1',
        password: 'Aa123456'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const element = await page.getByTestId('loginForm')
    await expect(element).toBeVisible()
  })
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })
  describe('When logged in', () => {
    const testBlog = {
      title: 'first blog title',
      author: 'Testor',
      url: 'test url'
    }

    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, testBlog)

      await expect(page.getByText('first blog title', {exact: true})).toBeVisible()
    })

    test('the blog can be liked', async ({page}) => {
      await createBlog(page, testBlog)

      await page.getByRole('button', {name: 'view'}).click()
      await page.getByRole('button', {name: 'like'}).click()
      
      const likeDiv =  page.locator('div:has-text("likes")')
      console.log(likeDiv);
      await expect(likeDiv.getByText("likes 1")).toBeVisible()
    })
    

    test(' the user who added the blog can delete the blog', async ({page}) => {
      await createBlog(page, testBlog)

      await page.getByRole('button', {name: 'view'}).click()
      
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', {name: 'remove'}).click()
      await expect(page.getByText('first blog title Testor')).not.toBeVisible()
    })

    test(' only the user who added the blog sees the blog\'s delete button', async ({page}) => {
      await createBlog(page, testBlog)
      
      // the user who added the blog can see the delete button
      await page.getByRole('button', {name: 'view'}).click()
      await expect(page.getByRole('button', {name: 'remove'})).toBeVisible()
      
      // log out, then log in with another account
      await page.getByRole('button', {name: 'log out'}).click()
      await loginWith(page, 'testor1', 'Aa123456')

      // the user who did not add the blog cannot see the delete button
      await page.getByRole('button', {name: 'view'}).click()
      await expect(page.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

    test('the blog with the most likes rendered first', async ({page}) => {
      const testBlog2 = {
        title: 'second blog title',
        author: 'Testor2',
        url: 'test url2'
      }
      const testBlog3 = {
        title: 'third blog title',
        author: 'Testor3',
        url: 'test url3'
      }
      await createBlog(page, testBlog)
      await createBlog(page, testBlog2)
      await createBlog(page, testBlog3)
      await page.locator('span', {hasText:'third blog title'}).waitFor()

      // like Blog2 twice
      const elements2 = await page.locator('span', { hasText: 'second blog title' }).locator('..')
      await elements2.getByRole('button', {name: 'view'}).click()
      await elements2.locator('..').getByRole('button', {name: 'like'}).click()
      await elements2.locator('..').getByText('likes 1').waitFor()
      await elements2.locator('..').getByRole('button', {name: 'like'}).click()
      
      // like Blog3 three times
      const elements3 = await page.locator('span', { hasText: 'third blog title' }).locator('..')
      await elements3.getByRole('button', {name: 'view'}).click()
      for (let index = 0; index < 3; index++) {
        await elements3.locator('..').getByRole('button', {name: 'like'}).click()
        await elements3.locator('..').getByText(`likes ${index+1}`).waitFor()
      }
      
      // validate the blogs rendered with descending order
      await page.goto('/')
      const elements = await page.getByRole('button', {name: 'view'})
      await elements.nth(0).click()
      await expect(page.getByText('likes 3')).toBeVisible()
    })
  })
  
})