class OrdersHistoryPage {

    constructor(page) {
        this.page = page;
        this.orderTable = page.locator('tbody');
        this.rows = page.locator("tbody tr");
        this.orderSummaryLocator = page.locator(".email-title");
        this.orderIdDetails = page.locator('.col-text');
    }

    async searchOrderAndSelect(orderId) {
        await this.orderTable.waitFor();
        const rows = this.rows;
        for (let i = 0; i < await rows.count(); i++) {
            const rowOrderId = await rows.nth(i).locator('th').textContent();
            if (orderId.includes(rowOrderId)) {
                await rows.nth(i).locator("button").first().click(); // Use chain locator process.
                break;
            }
        }
    }

    async getOrderId(){
        return await this.orderIdDetails.textContent();
    }

    getOrderSummaryLocator(){
        return this.orderSummaryLocator;
    }
}

module.exports = {OrdersHistoryPage}