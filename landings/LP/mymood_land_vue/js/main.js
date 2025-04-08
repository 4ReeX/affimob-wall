const app = new Vue({
    el: '#app',
    directives: {
        mask: VueMask.VueMaskDirective,
    },
    data: {
        msisdn: window.msisdn,
        resendOTP: false,
        phoneViewVisibility: false,
        subscribeViewVisibility: true,
        passwordViewVisibility: false,
        paymentViewVisibility: false,
        manySubsModalVisibility: false,
        subscribeSuspend: false,
        isGirlLanding: window.isGirlLanding,
        ageConfirm: false,
        errorCode: false,
        accessSectionError: '',
        isAoc: window.isAoc,
        csrfToken: window.csrfToken,
        promoterId: window.promoterId,
        promolink: window.promolink,
        otpCode: '',
        passwordIsVerified: false,
        autocompleteListenerAlreadySet: false,
        submitBtnEnabled: true,
    },
    methods: {
        openManySubsModal() {
            this.manySubsModalVisibility = true;
        },
        closeManySubsModal() {
            this.manySubsModalVisibility = false;
        },
        showPhoneView() {
            this.phoneViewVisibility = true;
            this.passwordViewVisibility = this.subscribeViewVisibility = this.paymentViewVisibility = false;
        },
        showPasswordView() {
            this.passwordViewVisibility = true;
            this.phoneViewVisibility = this.subscribeViewVisibility = this.paymentViewVisibility = false;
        },
        showPaymentView() {
            this.paymentViewVisibility = true;
            this.phoneViewVisibility = this.subscribeViewVisibility = this.passwordViewVisibility = false;
        },
        showSubscribeView() {
            this.subscribeViewVisibility = true;
            this.phoneViewVisibility = this.passwordViewVisibility = this.paymentViewVisibility = false;
        },
        async onConfirmAge() {
            this.accessSectionError = '';
            this.submitBtnEnabled = true;
            this.ageConfirm = true
        },
        async submitPassword() {
            this.errorCode = true;
            this.accessSectionError = 'Неверный пароль';
        },
        async sendOTP() {
            this.accessSectionError = ''
            this.passwordViewVisibility = true;
            this.addAutocompleteOtp();
        },
        async resendOTPCode() {
            this.sendOTP();
            this.resendOTP = true;
        },
        async finalize() {
            this.submitBtnEnabled = false;
        },

        async modelSubscribe() {
            await this.onConfirmAge();

            if (this.ageConfirm) {
                this.finalize();
            }
        },

        addAutocompleteOtp() {
            if (this.autocompleteListenerAlreadySet) {
                return;
            }

            const ac = new AbortController();
            navigator.credentials.get({
                otp: { transport:['sms'] },
                signal: ac.signal
            }).then(otp => {
                this.otpCode = otp.code;
                this.submitPassword()
            }).catch(err => {
                console.log(err);
            });

            this.autocompleteListenerAlreadySet = true;
        }
    },
    mounted(){}
})