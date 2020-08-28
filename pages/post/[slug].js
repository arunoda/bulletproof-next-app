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
  const markdownFiles = await fsPromises.readdir('data')

  const paths = markdownFiles.map(filename => {
    const slug = filename.replace(/.md$/, '')
    return {
      params: { slug }
    }
  })

  return {
    paths,
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
