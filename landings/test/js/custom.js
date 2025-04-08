// custom.js

// Функция для добавления реактивного счетчика
function addCounterToApp() {
    // Проверяем, что Vue-инстанс уже инициализирован
    if (window.app) {
        // Добавляем реактивный метод для счетчика
        Vue.set(window.app, 'counter', window.app.counter);  // Делаем поле counter реактивным
        window.app.$set(window.app, 'incrementCounter', function() {
            this.counter++;
        });

        console.log("Реактивный счетчик добавлен в Vue!");
    } else {
        console.error("Vue-инстанс не найден!");
    }
}

// Загружаем методы и функции после инициализации Vue
addCounterToApp();
