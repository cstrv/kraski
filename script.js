// script.js

async function getDistance() {
    // Определите URL-адрес запроса
    const url = 'http://194.87.216.209:3000/distance?origins=Krasnodar,Russia&destinations=Sochi,Russia&key=WUyWbmgUWU8Jg6E71aMRqZV2ZBiJAiYTUroajg7bFleHUIAdVNdIgd1nP9goces8';
    
    try {
        // Сделайте HTTP-запрос для получения данных от API
        const response = await fetch(url);
        
        // Проверьте, успешно ли выполнен запрос
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Преобразуйте ответ в JSON
        const data = await response.json();
        
        // Получите расстояние из ответа и отобразите его в HTML
        const distance = data.rows[0].elements[0].distance.text;
        document.getElementById('result').innerHTML = `Расстояние от Краснодара до Сочи: ${distance}`;
    } catch (error) {
        // Обработайте возможные ошибки
        console.error(error);
    }
}