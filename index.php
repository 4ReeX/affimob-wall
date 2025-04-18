<?php
$lpDir = __DIR__.'/LP'; // Абсолютный путь к директории
$providers = is_dir($lpDir) ? array_filter(scandir($lpDir), function($item) use ($lpDir) {
    return is_dir($lpDir . '/' . $item) && !in_array($item, ['.', '..']);
}) : [];
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <!-- ... предыдущие стили ... -->
</head>
<body>
    <!-- ... предыдущая разметка ... -->
    <script>
        async function handleAction(action, provider, landing) {
            const formData = new FormData();
            formData.append('provider', provider);
            formData.append('landing', landing);

            try {
                const response = await fetch(`api/${action}.php`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if(result.success) {
                    if(result.file) {
                        const link = document.createElement('a');
                        link.href = result.file;
                        link.download = result.filename;
                        link.click();
                    }
                    alert('Операция успешно выполнена');
                } else {
                    alert(result.error || 'Произошла ошибка');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка соединения');
            }
        }

        function takeScreenshot(p, l) {
            handleAction('screenshot', p, l);
        }

        function downloadZip(p, l) {
            handleAction('download', p, l);
        }
    </script>
</body>
</html>
