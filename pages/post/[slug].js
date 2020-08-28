import Theme from '../../components/Theme'
import ms from 'ms'
import Markdown from 'markdown-to-jsx'
import Youtube from '../../components/Youtube'
import { getPostList, getPost } from '../../lib/data'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Post ({ post }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Theme>
        loading...
      </Theme>
    )
  }

  if (!post) {
    return (
      <Theme>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        404 - Page not found!
      </Theme>
    )
  }

  return (
    <Theme>
      <div className='post'>
        <div className='time'>Published {ms(Date.now() - post.createdAt, { long: true })} ago</div>
        <h1>{post.title}</h1>
        <div className='content'>
          <Markdown
            options={{
              overrides: {
                Youtube: { component: Youtube }
              }
            }}
          >
            {post.content}
          </Markdown>
        </div>
      </div>
    </Theme>
  )
}

export async function getStaticPaths() {
  const postList = await getPostList()
  const paths = postList.map(post => ({
    params: {
      slug: post.slug
    }
  }))

  return {
    paths,
    fallback: true
  }
}


export async function getStaticProps ({ params }) {
  let post = null

  try {
    post = await getPost(params.slug)
  } catch (err) {
    if (err.status !== 404) {
      throw err
    }
  }

  return {
    props: {
      post
    },
    revalidate: 2
  }
}