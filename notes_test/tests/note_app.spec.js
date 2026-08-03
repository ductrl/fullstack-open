const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');
const { create } = require('node:domain');

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
          "username": "mikely",
          "name": "Michael Ly",
          "password": "12345678"
      }
    });

    await page.goto('/');
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(page.getByText('Note app, Department of Computer Science, University of Virginia 2025')).toBeVisible();
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mikely', '12345678');
    await expect(page.getByText('Michael Ly logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mikely', 'wrong');

    const errorDiv = page.locator('.error');
    await expect(errorDiv).toContainText('wrong credentials');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');

    await expect(page.getByText('Michael Ly logged in')).not.toBeVisible();
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mikely', '12345678');
      await expect(page.getByText('Michael Ly logged in')).toBeVisible();
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright');
      await expect(page.getByText('a note created by playwright')).toBeVisible();
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        // await page.pause();
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
