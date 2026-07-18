class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getLoginResponse(endpoint) {
        const loginResponse = await this.apiContext.post(endpoint, {
            data: this.loginPayload
        });
        return loginResponse;
    }

    async getCreateOrderResponse(endpoint, orderPayload, token) {
        const orderResponse = await this.apiContext.post(endpoint, {
            data: orderPayload,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }

        })
        return orderResponse;
    }

    async getToken(loginEndpoint) {
        const loginResponse = await this.getLoginResponse(loginEndpoint)
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;
    }

    async createOrder(createOrderEndpoint, orderPayload, token) {
        const orderResponse = await this.getCreateOrderResponse(
            createOrderEndpoint,
            orderPayload,
            token
        );
        const orderResponseJson = await orderResponse.json();
        const orderId = orderResponseJson.orders[0];
        return orderId;
    }

}

module.exports = { APIUtils };