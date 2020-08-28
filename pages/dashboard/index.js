import Link from 'next/link'
import Theme from '../../components/Theme'
import ms from 'ms'
import { getPostList } from '../../lib/data'
import { getSession } from 'next-auth/client'
import axios from 'axios'

export default function Home ({ postList }) {
  const handleDelete = async (e, post) => {
    e.preventDefault()
    
    const confirmed = confirm('Do you want to delete this blog post?')
    if (!confirmed) {
      return
    }
  
    try {
      await axios.delete(`/api/post?slug=${encodeURIComponent(post.slug)}`)
      location.reload()
    } catch(err) {
      alert(err.message)
    }
  }

  return (
    <Theme>
      <div className="dashboard">
        <div className="heading">
            <h2>Dashboard</h2>
            <Link href='/dashboard/post/create'>
                <a className="create-new">
                    + Create New
                </a>
            </Link>
        </div>
        <div className='dashboard-posts'>
          {postList.map(post => (
            <div key={post.slug} className='dashboard-post'>
              <div className='time'>{ms(Date.now() - post.createdAt, { long: true })} ago</div>
              <h3>{post.title}</h3>
              <div className="cta">
                <Link href='/dashboard/post/[slug]' as={`dashboard/post/${post.slug}`}>
                  <a className="edit">
                    Edit
                  </a>
                </Link>
                <a className="delete" href="#" onClick={e => handleDelete(e, post)}>
                  Delete
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Theme>
  )
}

export async function getServerSideProps ({ req, res }) {
  const session = await getSession({ req })
  if (!session) {
    res.writeHead(302, {
      'Location': '/'
    })
    res.end()
    return { props: {} }
  }
  
  const postList = await getPostList({ownerId: session.user.id})

  return {
    props: {
      postList
    }
  }
}