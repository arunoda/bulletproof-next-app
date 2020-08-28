import {compiler} from 'markdown-to-jsx'

export default function findImageInMarkdown(markdown) {
    const images = []

    compiler(markdown, {
        createElement(type, props) {
            if (type === 'img') {
                images.push(props.src)
                return
            }

            if (type === 'Youtube') {
                images.push(`https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`)
            }
        }
    })

    return images[0] || null;
}