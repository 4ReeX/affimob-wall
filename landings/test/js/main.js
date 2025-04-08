// main.js
window.app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        dynamicText: '',
        isAoc: isAoc,
        isGirlLanding: isGirlLanding,
        csrfToken: csrfToken,
        promolink: promolink,
        promoterId: promoterId,
        msisdn: msisdn,
        submitBtnEnabled: true,
        otpCode: '',
        errorCode: false,
        accessSectionError: '',
        passwordViewVisibility: false,
        subscribeViewVisibility: true,
        paymentViewVisibility: false,
        ageConfirm: true,
        resendOTP: false,
        submitBtnEnabled: true,
        counter: 0  // Стартовое значение счетчика
    },
    methods: {
        sendOTP() {
            console.log("OTP sent");
        },
        resendOTPCode() {
            this.resendOTP = !this.resendOTP;
        },
        submitPassword() {
            console.log("Password submitted");
        },
        onConfirmAge() {
            this.ageConfirm = false;
        },
        finalize() {
            console.log("Finalizing...");
        },
        modelSubscribe() {
            console.log("Model subscribed");
        },
    }
});
