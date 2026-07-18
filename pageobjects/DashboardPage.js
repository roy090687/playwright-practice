class DashboardPage {

    constructor(page) {
        this.products = page.locator(".card-body");
        this.prodTitles = page.locator('.card-body b');
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
    }

    async searchForProduct(productName) {
        const allTitles = await this.products.allTextContents();
        console.log(allTitles)

        const count = await this.products.count();
        for (let i = 0; i < count; i++) {
            if (await this.products.nth(i).locator("b").textContent() === productName) {
                // add to cart
                await this.products.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart() {
        await this.cart.click();
    }

    async navigateToOrders() {
        await this.orders.click();
    }

}

module.exports = { DashboardPage }