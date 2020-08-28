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
        [type]: profile,
        profile: {
            name: profile.name,
            avatar: profile.avatar
        }
    }
    
    await fsCms.saveUser(user)
    return user.id
}

export async function getUser(id) {
    return fsCms.getUser(id)
}

export async function getComments(slug) {
    if (canUseGitHub()) {
        return githubCms.getComments(slug)
    }

    return fsCms.getComments(slug)
}

export async function addComment(slug, comment) {
    if (canUseGitHub()) {
        return githubCms.addComment(slug, comment)
    }

    return fsCms.addComment(slug, comment)
}