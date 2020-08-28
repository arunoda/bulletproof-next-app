import Header from './Header'

export default function Theme ({ children }) {
  return (
    <div>
      <Header />
      {children}
      <style jsx global>{`
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                    -webkit-font-smoothing: antialiased;
                    margin: 0;
                    padding: 0;
                }

                .header {
                    background-color: #8bc34a;
                    padding: 30px;
                    display: flex;
                    align-items: center;
                    line-height: 30px;
                }

                .header a {
                    text-decoration: none;
                    color: #000;
                    font-weight: 600;
                    margin-left: 20px;
                }

                .header a:hover {
                    color: #fff;
                }

                .header .user-info,
                .header .user-info a {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                }

                .header img {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 10px;
                    border: 2px solid hsl(88deg, 60%, 85%);
                }

                .dashboard {
                    margin: 50px auto;
                    max-width: 650px;
                    padding: 0 30px;
                }

                .post-list {
                    margin: 50px auto;
                    max-width: 650px;
                    padding: 0 30px;
                }

                .post-list .post-link a {
                    display: block;
                    border: 1px solid #8bc34a;
                    color: #222;
                    text-decoration: none;
                    font-weight: 600;
                    padding: 15px;
                    border-radius: 2px;
                    margin: 20px 0;
                }

                .post-list .post-link a .time {
                    font-size: 12px;
                    font-weight: 400;
                    margin: 0 0 3px 0;
                    opacity: 0.8;
                }

                .post-list .post-link a:hover {
                    background-color: #8bc34a;
                    color: #fff;
                }

                .post {
                    margin: 50px auto;
                    max-width: 650px;
                    padding: 0 30px;
                    color: rgb(51, 51, 51);
                    line-height: 28px;
                    font-size: 18px;
                }

                .post a {
                    color: #1e88e5;
                    text-decoration: none;
                }

                .post a:hover {
                    border-bottom: 1px solid #1e88e5;
                }

                .post img {
                    max-width: 100%;
                    margin: 30px 0;
                }

                .post .time {
                    color: #666;
                    font-size: 13px;
                }

                .post h1 {
                    margin: 0 0 30px 0;
                    line-height: 40px;
                }

                .post .content {
                    border-bottom: 1px solid #eee;
                    margin-bottom: 20px;
                }

                .comment {
                    border: 1px solid #EEE;
                    border-radius: 4px;
                    margin: 10px 0;
                    max-width: 650px;
                }

                .comment.client-only {
                    opacity: 0.6;
                }

                .comment.error {
                    opacity: 1;
                    color: hsl(0deg, 50%, 40%);;
                    background-color: hsl(0deg, 50%, 95%);
                }

                .comment-author {
                    display: flex;
                    align-items: center;
                    border-top: 1px solid #EEE;
                    padding: 10px;
                    font-size: 11px;
                    background-color: #FAFAFA;
                }

                .comments-info {
                    padding: 15px 0;
                    font-size: 14px;
                }

                .comment-content {
                    padding: 15px 10px;
                    font-size: 14px;
                }

                .comment-content p:first-child {
                    margin-top: 0;
                }

                .comment-content p:last-child {
                    margin-bottom: 0;
                }

                .comment-author img {
                    width: 20px;
                    height: 20px;
                    border-radius: 20px;
                    margin: 0 5px 0 0;
                }

                .add-comment-box {
                    border-top: 1px solid #eee;
                    padding: 10px 0 10px 0;
                }

                .add-comment-box textarea {
                    margin: 10px 0 5px 0;
                    width: calc(100% - 20px);
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    height: 50px;
                    padding: 10px 10px;
                }

                .comment {
                    width: 100%;
                    border: 1px solid #eee;
                    border-radus: 4px;
                }

                .preview-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    padding: 10px;
                    background-color: #f8bbd0;
                    font-size: 12px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .preview-bar button {
                    margin-left: 10px;
                    font-size: 12px;
                    text-transform: uppercase;
                }

                .youtube-container {
                    position: relative;
                    cursor: pointer;
                }
    
                .youtube-container .click-to-play {
                    position: absolute;
                    width: 200px;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 20px;
                    box-shadow: 0px 0px 7px 1px #9e9e9e;
                    color: #FFF;
                    background-color: #ca0c0c;
        
                    text-align: center;
                    left: 50%;
                    margin-left: -100px;
                    top: 50%;
                    margin-top: -17px;
                    pointer-events:none;
        
                    font-family: arial;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    font-size: 13px;
                    font-weight: bold;
                }
    
                .youtube-container :global(img) {
                    border: 0;
                    box-shadow: 0px 0px 7px 0px #9e9e9e;
                    border-radius: 4px;
                }
    
                .youtube-container:hover {
                    opacity: 0.8;
                }

                .dashboard {
                    margin: 50px auto;
                    max-width: 650px;
                    padding: 0 30px;
                }

                .dashboard p a {
                    color: #1e88e5;
                    text-decoration: none;
                }

                .dashboard p a:hover {
                    border-bottom: 1px solid #1e88e5;
                }

                .dashboard .heading {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .dashboard .create-new {
                    margin: 0 0 0 auto;
                    text-decoration: none;
                    font-size: 14px;
                    line-height: 20px;
                    padding: 5px 15px;
                    border-radius: 2px;
                    font-weight: 500;
                    background-color: hsl(199deg, 100%, 80%);
                    color: hsl(199deg, 100%, 10%);
                }

                .dashboard .create-new:hover {
                    opacity: 0.8;
                }

                .dashboard-post {
                    display: block;
                    border: 1px solid #8bc34a;
                    color: #222;
                    text-decoration: none;
                    padding: 15px;
                    border-radius: 2px;
                    margin: 20px 0;
                }

                .dashboard-post h3 {
                    margin: 5px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .dashboard-post .time {
                    color: #666;
                    font-size: 12px;
                }

                .dashboard-post a {
                    margin-right: 5px;
                    text-decoration: none;
                    font-size: 10px;
                    padding: 2px 10px;
                    border-radius: 2px;
                    font-weight: 500;
                }

                .dashboard-post a:hover {
                    opacity: 0.8;
                }

                .dashboard-post a.delete {
                    background-color: hsl(0deg, 100%, 80%);
                    color: hsl(0deg, 100%, 10%);
                }

                .dashboard-post a.edit {
                    background-color: hsl(45deg, 100%, 80%);
                    color: hsl(45deg, 100%, 10%);
                }

                .dashboard input,
                .dashboard textarea {
                    margin: 5px 0;
                    padding: 5px;
                    width: 100%;
                    border: 1px solid hsl(0deg, 0%, 80%);
                }

                .dashboard textarea {
                    height: 250px;
                }
            `}
      </style>
    </div>
  )
}
