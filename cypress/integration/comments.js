function addComment(commentText) {
    cy.get('textarea').type(commentText)
    cy.get('button').contains('Add Comment').click()
}

describe('Comments', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3009')
        cy.get('.post-list').contains('Hello World').click()
        cy.get('h1').contains('Hello World')
        cy.resetData()
    })

    it('should allow to add a comment', () => {
        const username = Math.random()
        const commentText = Math.random()

        cy.login(username)
        addComment(commentText)

        cy.get('.comment').contains(commentText)
        cy.get('.comment-author').contains(username)
    })

    it('should allow to view comments without logging in', () => {
        const username = Math.random()
        const commentText = Math.random()

        cy.login(username)
        addComment(commentText)

        cy.get('a').contains('Logout').click()
        cy.get('a').contains('Login')

        cy.get('.comment').contains(commentText)
        cy.get('.comment-author').contains(username)
    })
})