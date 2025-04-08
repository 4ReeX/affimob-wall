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
        isHidden: false, // Флаг для сокрытия элементов на странице
        message: '220 000 книг разных жанров всегда с вами',
        currentIcon: 1, // Для переключения иконок
        fading: false, // Флаг для управления анимацией
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
            this.isCenter = !this.isCenter; // Добавляем или убираем класс .center
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
            this.accessSectionError = '';
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
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then(otp => {
                this.otpCode = otp.code;
                this.submitPassword();
            }).catch(err => {
                console.log(err);
            });

            this.autocompleteListenerAlreadySet = true;
        },
        switchIcon() {
            // Запускаем анимацию исчезновения текущей иконки
            this.fading = true;
            setTimeout(() => {
                // Меняем текущую иконку после завершения затухания
                this.currentIcon = this.currentIcon === 1 ? 2 : 1;
                this.fading = false; // Сбрасываем флаг после смены
            }, 1000); // Задержка равна времени перехода (1s)
        },
    },
    mounted() {
        setInterval(this.switchIcon, 3000); // Меняем иконку каждые 3 секунды
    },
});
