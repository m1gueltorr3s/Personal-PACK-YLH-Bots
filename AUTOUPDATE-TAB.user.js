// ==UserScript==
// @name         Actualizar página YouLikeHits al detectar texto
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Actualiza la página de YouLikeHits si detecta ciertos textos específicos
// @author       Tú
// @match        https://www.youlikehits.com/youtubenew2.php
// @match        https://www.youlikehits.com/websites.php
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Textos a buscar en la página
    const textosObjetivo = [
        "There are no videos available to view at this time. Try coming back or refreshing.",
        "YouTube Limit\nYou have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 15 minutes until you can do Views again.",
        "There are no Websites currently visitable for Points.",
        "You have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 2 minutes until you can do Views again."
    ];

    // Función que verifica si alguno de los textos está presente en el cuerpo de la página
    function verificarTextoYActualizar() {
        // Itera sobre los textos objetivo y verifica si alguno está presente en la página
        for (let texto of textosObjetivo) {
            if (document.body.textContent.includes(texto)) {
                // Si encuentra uno de los textos, actualiza la página automáticamente
                location.reload();
                break;
            }
        }
    }

    // Ejecuta la función inmediatamente cuando la página cargue
    window.onload = verificarTextoYActualizar;

    // También se puede ejecutar cada cierto tiempo (por ejemplo, cada 1.5 segundos) para detectar si los textos aparecen más tarde
    setInterval(verificarTextoYActualizar, 1500); // 1500 milisegundos = 1.5 segundos
})();
