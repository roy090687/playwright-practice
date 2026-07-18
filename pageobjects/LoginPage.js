class LoginPage {

    constructor(page) {
        this.page = page;
        this.username = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.loginBtn = page.locator("[value='Login']");
    }

    async goTo() {
        const url = 'https://rahulshettyacademy.com/client/';
        await this.page.goto(url);
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.type(password);
        await this.loginBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = {LoginPage};