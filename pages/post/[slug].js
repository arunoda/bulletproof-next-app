import Theme from '../../components/Theme'
import ms from 'ms'
import { promises as fsPromises } from 'fs'
import Markdown from 'markdown-to-jsx'

export default function Post ({ post }) {
  return (
    <Theme>
      <div className='post'>
        <div className='time'>Published {ms(Date.now() - post.createdAt, { long: true })} ago</div>
        <h1>{post.title}</h1>
        <div className='content'>
          <Markdown>{post.content}</Markdown>
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

export async function getStaticProps ({ params }) {
  const [year, month, day, ...rest] = params.slug.split('-')
  const createdAt = (new Date(`${year} ${month} ${day}`)).getTime()
  const title = rest.join(' ')

  const content = await fsPromises.readFile(`data/${params.slug}.md`, 'utf8')

  return {
    props: {
      post: {
        slug: params.slug,
        title,
        content,
        createdAt
      }
    }
  }
}
