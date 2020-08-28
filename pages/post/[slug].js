import Theme from '../../components/Theme'
import ms from 'ms'
import Markdown from 'markdown-to-jsx'
import Youtube from '../../components/Youtube'
import githubCms from '../../lib/github-cms'
import { useRouter } from 'next/router'

export default function Post ({ post }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Theme>
        loading...
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
  const postList = await githubCms.getPostList()
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
  const post = await githubCms.getPost(params.slug)

  return {
    props: {
      post
    },
    revalidate: 2
  }
}