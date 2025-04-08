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
        isFull: false, // Флаг для добавления класса
        isHidden: false,  // Флаг для сокрытия элементов на странице
        users: [
            { nickname: 'EvaPsss', phrase: 'Как на личном?', avatar: 'assets/images/ava4-8.png', status: true, visibleOnSmallScreen: true },
            { nickname: 'VikiMe', phrase: 'Ушла краситься', avatar: 'assets/images/ava4-7.png', status: true, visibleOnSmallScreen: true },
            { nickname: 'MiMiMilfa', phrase: 'Привет, котятки, как...', avatar: 'assets/images/ava4-6.png', status: true, visibleOnSmallScreen: true },
            { nickname: 'Alika', phrase: '<З всем привет', avatar: 'assets/images/ava4-5.png', status: true, visibleOnSmallScreen: false },
            { nickname: 'SweetLove', phrase: 'Заходи пообщаться', avatar: 'assets/images/ava4-4.png', status: false, visibleOnSmallScreen: true },
            { nickname: 'Aurennn', phrase: 'Только ЛС. Строго...', avatar: 'assets/images/ava4-3.png', status: true, visibleOnSmallScreen: false },
            { nickname: 'Irinka', phrase: 'Сегодня отдыхаю', avatar: 'assets/images/ava4-2.png', status: false, visibleOnSmallScreen: false },
            { nickname: 'Matica', phrase: '(нет статуса)', avatar: 'assets/images/ava4-1.png', status: true, visibleOnSmallScreen: true },
            { nickname: 'LollyPop', phrase: 'Только регнулась', avatar: 'assets/images/ava4.png', status: true, visibleOnSmallScreen: true },
        ],
        filteredUsers: [], // Список пользователей после фильтрации
        messages: [
            { text: 'Привет.', type: 'message', delay: 0 },
            { text: 'чем занимаешься? Как тебе фотка?', type: 'message', delay: 2 },
            { text: 'не прочитанное сообщение', type: 'noReply', delay: 4 },
            { text: '', type: 'photo', delay: 4 },

        ],
        activeMessages: [],
        dialogVisible: false, // Флаг видимости диалогового окна
        currentUser: {}, // Данные текущего выбранного пользователя
        duration: 10, // Таймер в секундах
        maxDuration: 10, // Максимальное время для расчета прогресса
        size: 100, // Размер SVG
        strokeWidth: 3, // Толщина линии
        timerFinished: false, // Флаг завершения таймера
        isButtonPulsing: false,
    },
    computed: {
        center() {
            return this.size / 2; // Центр SVG
        },
        radius() {
            return (this.size - this.strokeWidth) / 2; // Радиус круга
        },
        circumference() {
            return 2 * Math.PI * this.radius; // Длина окружности
        },
        dashOffset() {
            // Увеличиваем прогресс от 0 до полной длины окружности
            return ((this.maxDuration - this.duration) / this.maxDuration) * this.circumference;
        },
    },
    methods: {
        filterUsersByScreenHeight() {
            const screenHeight = window.innerHeight;
            this.filteredUsers = this.users.filter(user => {
                // Пользователи с visibleOnSmallScreen=true отображаются только на больших экранах
                if (screenHeight < 650 && !user.visibleOnSmallScreen)  {
                    return false;
                }
                return true;
            });
        },
        showMessages() {
            let messagesToShow = this.messages.length; // Общее количество сообщений

            this.messages.forEach((message, index) => {
                setTimeout(() => {
                    this.activeMessages.push(message);
                    // Когда все сообщения добавлены, запускаем таймер
                    if (this.activeMessages.length === messagesToShow) {
                        this.startTimer();
                    }
                }, message.delay * 1000); // Устанавливаем задержку
            });
        },
        startTimer() {
            if (this.intervalId) return; // Защита от повторного запуска
            this.intervalId = setInterval(() => {
                if (this.duration > 0) {
                    this.duration--;
                } else {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                    this.timerFinished = true; // Таймер завершен
                }
            }, 1000);
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
        async toggleView(user) {
            this.isFull = !this.isFull; // Добавляем или убираем класс .full
            this.isHidden = !this.isHidden; // Скрываем или показываем блоки
            this.onConfirmAge();
            this.currentUser = user; // Устанавливаем данные выбранного пользователя
            this.dialogVisible = true; // Показываем диалоговое окно
            this.startTimer();
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
    mounted(){
        this.showMessages();
        this.filterUsersByScreenHeight(); // Фильтрация при загрузке страницы
        window.addEventListener('resize', this.filterUsersByScreenHeight); // Обновляем при изменении размера экрана
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.filterUsersByScreenHeight); // Удаляем слушатель при разрушении компонента
    }
})

