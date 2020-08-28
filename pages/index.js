import Link from 'next/link'
import Theme from '../components/Theme'
import ms from 'ms'
import { promises as fsPromises } from 'fs'

export default function Home ({ postList }) {
  return (
    <Theme>
      <div className='post-list'>
        {postList.map(post => (
          <div key={post.slug} className='post-link'>
            <Link href='/post/[slug]' as={`/post/${post.slug}`}>
              <a>
                <div className='time'>{ms(Date.now() - post.createdAt, { long: true })} ago</div>
                <div className='title'>{post.title}</div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </Theme>
  )
}

export async function getStaticProps () {
  const markdownFiles = await fsPromises.readdir('data')

  const postList = markdownFiles.map(filename => {
    const slug = filename.replace(/.md$/, '')
    const [year, month, date, ...rest] = slug.split('-')
    const createdAt = (new Date(`${year} ${month} ${date}`)).getTime()
    const title = rest.join(' ')

    return {
      slug,
      createdAt,
      title
    }
  })

  return {
    props: {
      postList
    }
  }
}
