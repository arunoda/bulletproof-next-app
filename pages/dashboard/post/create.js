import Theme from '../../../components/Theme'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { useSession } from 'next-auth/client'

export default function CreatePost({ }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [session, loading] = useSession()

  if (loading) {
    return 'loading...'
  }
  
  if (!session) {
    return (
      <Theme>
        <div className="dashboard">
          <p>
            You are not allowed to visit this page.
          </p>
          <p>
            Visit the <Link href="/"><a>homepage</a></Link>
          </p>
        </div>
      </Theme>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      await axios.post('/api/post', {
        title,
        content,
        slug: title.replace(/ /g, '-')
      })
      router.push('/dashboard')
    } catch(err) {
      return alert(err.message)
    } finally {
      setSubmitting(false)
    }

    router.push('/dashboard')
  }

  return (
    <Theme>
      <div className="dashboard">
        <form className='create-post' onSubmit={handleSubmit}>
          <h2>Create New Blog Post</h2>
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