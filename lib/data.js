import githubCms from './github-cms'
import * as fsCms from './fs-cms'

function canUseGitHub() {
    return Boolean(process.env.GITHUB_PAT)
}

export async function getPostList() {
    if (canUseGitHub()) {
        return githubCms.getPostList()
    }

    return fsCms.getPostList()
}

export async function getPost(slug) {
    if (canUseGitHub()) {
        return githubCms.getPost(slug)
    }
    
    return fsCms.getPost(slug)
}

const users = {}

export async function saveUser(type, profile) {
    const user = {
        id: `${type}-${profile.id}`,
        [type]: profile
    }

    await fsCms.saveUser(user)
    return user.id
}

export async function getUser(id) {
    return fsCms.getUser(id)
}