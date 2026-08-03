import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch {
      console.log('wrong credentials');
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username 
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  if (user === null) {
    return loginForm();
  }

  const blogsToShow = blogs.filter(b => b.user && b.user.id !== user.id);

  return (
    <div>
      <h2>blogs</h2>
      {user.name} logged in
      {blogsToShow.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App