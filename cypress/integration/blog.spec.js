describe("Blog", () => {
    it('should display blog posts', () => {
        cy.visit('http://localhost:3009')
        cy.get('.post-list').contains('Hello World')
    })

    it('should allow to view a blog post', () => {
        cy.visit('http://localhost:3009')
        cy.get('.post-list').contains('Hello World').click()
        cy.get('h1').contains('Hello World')
        cy.get('.content').contains('This is my first blog post using a markdown file')
    })
})