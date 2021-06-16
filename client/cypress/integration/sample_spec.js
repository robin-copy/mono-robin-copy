describe('End to end test with data', function () {

    afterEach(function() {
        cy.get('.search-bar-input').clear()
    })

    it('Visit page and have main components', function () {
        cy.visit('http://192.168.0.121:3000');
        cy.get('.stock-section');
        cy.get('.portfolio-summary');
    });

    it('should find all main data from portfolio summary', function () {
        cy.get('.portfolio-summary');
        cy.get('.total-data').children('.balance-container.summary-container')
        cy.get('.all-data').find('.list-item').should('have.length', 3)
        cy.get('.all-data').find('.list-item').find('.shareNameContainer')
        cy.get('.all-data').find('.list-item').find('.shareInformation').children().should('have.length', 5*3)

    });

    it('should type in searchbar and find a stock', function () {
        cy.get('.search-bar-input')
            .type('aapl');
        cy.get('.stock-section').find('.list-container').children().should('have.length', 1)
        cy.get('.empty-list-message-container').should('not.exist');
    });

    it('should type in searchbar and find no stock', function () {
        cy.get('.search-bar-input')
            .type('z');
        cy.get('.stock-section').find('.list-container').children().should('not.exist')
    })


    it('find a stock and click it', function () {
        cy.get('.search-bar-input')
            .type('aapl');
        cy.get('.stock-section').find('.list-container').should('have.length', 1);
        cy.get('[data-testid=shareListItem]').click();
        cy.get('.stock').find('.graph');
        cy.get('.sub-header2')
        cy.get('h3');
        cy.get('.table');
        cy.get('.stock-volume-data').children().should('have.length', 5);
        cy.get('.stock-value-data').children().should('have.length', 5);
    });

    it('should enter and exit a stock', function () {
        cy.get('.search-bar-input')
            .type('aapl');
        cy.get('.stock-section').find('.list-container').should('have.length', 1);
        cy.get('[data-testid=shareListItem]').click();
        cy.get('.portfolio-summary').should('not.exist');
        cy.get('.stock');
        cy.get('[data-testid="cross-button"]').click();
        cy.get('.portfolio-summary');
    });

});

describe('end to end test without data', function () {
    beforeEach(function () {
        cy.intercept(
            {
                method: 'GET', // Route all GET requests
                url: '/users/defaultUser', // that have a URL that matches '/users/*'
            },
            '1' // and force the response to be: []
        )
    })

    it('should show empty share list', function () {
        cy.visit('http://192.168.0.121:3000');
        cy.get('[data-testid="emptyShareListContainer"]');
        cy.get('[data-testid="emptyDataContainer"]');
    });
})
