import { get } from './utilities/http';
import { useState, useEffect, type ReactNode } from 'react';
import BlogPosts, { type BlogPost } from './components/BlogPosts';
import dataFetching from './assets/data-fetching.png';
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function App() {
  const [fetchedPosts, setFetchPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsData = async () => {
      setIsFetching(true);
      try {
      const data = await get('https://jsonplaceholder.typicode.com/posts') as RawDataBlogPost[];

      const blogPostsData: BlogPost[] = data.map((post) => ({
        id: post.id,
        title: post.title,
        text: post.body,
      }));
      setFetchPosts(blogPostsData);
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError('An unknown error occurred');
        }
      }
      setIsFetching(false);
    }
    fetchPostsData();
  }, [])

  let content: ReactNode;


  if(fetchError) {
    content = <ErrorMessage text={fetchError} />
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  } 
  
  if (isFetching) {
    content = <p>Loading blog posts...</p>
  }

  return (
    <main>
      <img src={dataFetching} alt="Data Fetching Illustration" />
      {content}
    </main>
  )
}

export default App
