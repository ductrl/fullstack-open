const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const supertest = require('supertest');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('all blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('unique identifier property of the blogs is named id', async () => {
  const blogs = await helper.blogInDb();
  assert.ok(blogs[0].id);
  assert.strictEqual(typeof blogs[0].id, 'string');
})

test('a valid post can be added', async () => {
  const blogToBeAdded = {
    title: 'Test New Blog',
    author: 'Bruce Lee',
    url: 'https://pizza.com/',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogInDb();
  const titles = blogsAtEnd.map(b => b.title)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  assert(titles.includes(blogToBeAdded.title));
})

test('default likes value to 0 if missing', async () => {
  const blogToBeAdded = {
    title: 'Test New Blog',
    author: 'Bruce Lee',
    url: 'https://pizza.com/',
  };

  const response = await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
})

test('a post without title can\'t be added', async () => {
  const blogWithoutTitle = {
    author: 'Bruce Lee',
    url: 'https://pizza.com/',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
})

test('a post without url can\'t be added', async () => {
  const blogWithoutUrl = {
    title: 'Test New Blog',
    author: 'Bruce Lee',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

describe('deletion of a blog post', () => {
  test('succeeds with statuscode 204 if id is valid', async () => {
    const blogAtStart = await helper.blogInDb();
    const blogToDelete = blogAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogAtEnd = await helper.blogInDb();
    const titles = blogAtEnd.map(blog => blog.title);

    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1);
    assert(!titles.includes(blogToDelete.title));
  })
})

describe('update a blog post', () => {
  test('succeeds with statuscode 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogInDb();
    const blogToUpdate = blogsAtStart[0];
    const updateBlog = { title: 'This blog was updated' };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogInDb();
    const titles = blogsAtEnd.map(blog => blog.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    assert(titles.includes(updateBlog.title));
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const nonExistingId = await helper.nonExistingId();
    const updateBlog = { title: 'This blog was updated' };

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(updateBlog)
      .expect(404);

    const blogsAtEnd = await helper.blogInDb();
    const titles = blogsAtEnd.map(blog => blog.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    assert(!titles.includes(updateBlog.title));
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = 'hahahahahhahahahha';
    const updateBlog = { title: 'This blog was updated' };

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updateBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogInDb();
    const titles = blogsAtEnd.map(blog => blog.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    assert(!titles.includes(updateBlog.title));
  })
})

after(async () => {
  await mongoose.connection.close();
})