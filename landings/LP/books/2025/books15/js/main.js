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
        isGirlLanding: false,
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
        isBodyCenter: false,
        isCenter: false,
        isHidden: false,  // Флаг для сокрытия элементов на странице
        message: 'Тысячи книг по фантастике и другим жанрам всегда с вами',
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
            this.ageConfirm = true;
        },
        async toggleView() {
            this.isCenter = !this.isCenter // Добавляем или убираем класс .center
            this.isBodyCenter = !this.isBodyCenter; // Добавляем или убираем класс.body-center
            this.isHidden = !this.isHidden; // Скрываем или показываем блоки
            this.onConfirmAge();
        },
        async submitPassword() {
            this.isAoc = false;
            this.accessSectionError = true;
            if (this.passwordIsVerified) {
                this.finalize();
            }
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
            document.getElementById("finalize").submit();
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

