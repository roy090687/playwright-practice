const { expect } = require('@playwright/test');

class CartPage {

    constructor(page) {
        this.page = page;
        this.cartFirstOption = page.locator("div li").first();
        this.checkoutBtn  = page.locator("text=Checkout");
    }

    async verifyProductIsDisplayed(productName) {
        await this.cartFirstOption.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy;
    }

    async checkout() {
        await this.checkoutBtn.click();
    }


    getProductLocator(productName) {
        return this.page.locator(`article:has-text("${productName}")`);
    }
}

module.exports = { CartPage }