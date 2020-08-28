import Theme from '../../../components/Theme'
import { getPost } from '../../../lib/data'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/client'
import { useState } from 'react'
import axios from 'axios'

export default function EditPost({ post }) {
  const [title, setTitle] = useState(post && post.title)
  const [content, setContent] = useState(post && post.content)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      await axios.patch(`/api/post?slug=${encodeURIComponent(post.slug)}`, {
        title,
        content
      })
      router.push('/dashboard')
    } catch(err) {
      return alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Theme>
      <div className="dashboard">
        <form className='edit-post' onSubmit={handleSubmit}>
          <h2>Edit: {post.title}</h2>
          <input
            type="text"
            placeholder="Add your blog post title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <br/>
          <textarea
            placeholder="Add your blog post content"
            onChange={e => setContent(e.target.value)}
            value={content}
          />
          <br/>
          <button disabled={submitting}>
            {submitting? 'submitting ...' : 'Submit'}
          </button>
        </form>
      </div>
    </Theme>
  )
}

export async function getServerSideProps({ req, res, params }) {
    const session = await getSession({ req })
    if (!session) {
      res.writeHead(302, {
        'Location': '/'
      })
      res.end()
      return { props: {} }
    }
  
    const post = await getPost(params.slug, { ownerId: session.user.id })
  
    return {
      props: {
        post
      }
    }
  }