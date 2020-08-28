import { getPostList } from '../../lib/data'

const hostname = "https://yourapp.com"

function getSitemapEntry({pathname, priority = 0.5}) {
    return `
        <url>
            <loc>${hostname}${pathname}</loc>
            <priority>${priority}</priority>
        </url>
    `
}

export default async function sitemap(req, res) {
    const posts = await getPostList()
    
    const entries = posts.map(post => getSitemapEntry({
        pathname: `/post/${post.slug}`
    }))
    entries.push(getSitemapEntry({
        pathname: '/',
        priority: 1
    }))

    const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${entries.join('\n')}
        </urlset>      
    `.trim()

    res.writeHead(200, {
        'Content-Type': 'application/xml'
    })
    return res.end(sitemap);
}