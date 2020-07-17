import Theme from '../../components/Theme'
import ms from 'ms'

export default function Post ({ post, previewData }) {
  return (
    <Theme>
      <div className='post'>
        <div className='time'>Published {ms(Date.now() - post.createdAt, { long: true })} ago</div>
        <h1>{post.title}</h1>
        <div className='content'>
          {post.content}
        </div>
      </div>
    </Theme>
  )
}

export async function getStaticPaths () {
  return {
    paths: [
      {
        params: { slug: '2020-July-01-Hello-World' }
      }
    ],
    fallback: false
  }
}

export async function getStaticProps ({ params, previewData = null }) {
  const [year, month, day, ...rest] = params.slug.split('-')
  const createdAt = (new Date(`${year} ${month} ${day}`)).getTime()
  const title = rest.join(' ')

  return {
    props: {
      post: {
        slug: params.slug,
        title,
        content: `This is the content for ${title}`,
        createdAt
      }
    }
  }
}
