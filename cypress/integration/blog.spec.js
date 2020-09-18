describe("Blog", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3009')
    })
    
    it('should display blog posts', () => {
        cy.get('.post-list').contains('Hello World')
    })

    it('should allow to view a blog post', () => {
        cy.get('.post-list').contains('Hello World').click()
        cy.get('h1').contains('Hello World')
        cy.get('.content').contains('This is my first blog post using a markdown file')
    })

    it('should add proper seo info to a blog post', () => {
        cy.get('.post-list').contains('Hello World').click()
        cy.get('h1').contains('Hello World')

        cy.get('head title').should('contain', 'Hello World')
        cy.get('meta[name="description"]').should('have.attr', 'content').and('match', /This is my first blog post/)
        cy.get('meta[property="og:image"]').should('have.attr', 'content').and('match', /youtube/)
    })
})