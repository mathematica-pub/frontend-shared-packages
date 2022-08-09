describe('spec.cy.js', () => {
    it('should visit', () => {
        cy.visit('/start');
        cy.percySnapshot();
    })
})