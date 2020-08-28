import React, { useState } from 'react'

export default function Youtube (props) {
  const { videoId, width = '100%', height = 350 } = props
  const [showVideo, setShowVideo]  = useState(Boolean(props.autoPlay))
  const overlay = `https://i.imgur.com/IhVEPVL.png`

  const renderVideo =  () => {
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    return (
      <>
        <iframe width={width} height={height} src={src} frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen='1' />
        <style jsx>{`
          iframe {
            margin: 20px 0;
          }
        `}
        </style>
      </>
    )
  }

  const handleShowVideo = () => {
    setShowVideo(true)
  }

  if (showVideo) {
    return renderVideo({ autoplay: true })
  }

  return (
    <div className='youtube'>
      <div className='click-to-play' onClick={() => handleShowVideo()}>Play Now</div>
      <img src={overlay} onClick={() => handleShowVideo()} />
      <style jsx>{`
        .youtube {
          position: relative;
          cursor: pointer;
          margin: 20px 0;
          opacity: 0.8;
        }
        
        .youtube:hover {
          opacity: 1;
        }

        .click-to-play {
          position: absolute;
          width: 200px;
          height: 30px;
          line-height: 30px;
          border-radius: 20px;
          box-shadow: 0px -2px 40px 10px hsl(0deg, 0%, 90%), 0px 3px 0px 0px hsl(0deg, 100%, 50%);
          color: #FFF;
          background-color: hsl(0deg 89% 42%);

          text-align: center;
          left: 50%;
          margin-left: -100px;
          top: 50%;
          margin-top: -17px;

          font-family: arial;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: 13px;
          font-weight: bold;
        }

        .click-to-play:hover {
          background-color: hsl(0deg 79% 52%)
        }

        div :global(img) {
          border: 0;
        }
      `}
      </style>
    </div>
  )
}
