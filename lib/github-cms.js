import { GitHubCMS } from '@arunoda/git-cms'

const githubCms = new GitHubCMS({
    owner: process.env.GITHUB_REPO_OWNER,
    repo: process.env.GITHUB_REPO_NAME,
    token: process.env.GITHUB_PAT
})

export default githubCms
