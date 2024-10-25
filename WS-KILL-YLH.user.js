// ==UserScript==
// @name         Auto-cierre en YouLikeHits
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Monitorea y cierra la pestaña en caso de mensajes específicos
// @match        https://www.youlikehits.com/viewwebsite.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Función para monitorear el contenido de la página
    function checkPage() {
        // Lista de frases para buscar en el contenido de la página
        const phrases = [
            "We couldn't locate the website you're attempting to visit.",
            "You got"
        ];

        // Recorre cada frase y verifica si está presente en el texto de la página
        for (const phrase of phrases) {
            if (document.body.innerText.includes(phrase)) {
                // Redirige a about:blank y cierra la pestaña actual
                window.location.href = 'about:blank';
                setTimeout(() => window.close(), 100); // Da un breve tiempo antes de cerrar
                break;
            }
        }
    }

    // Monitorea el contenido de la página cada 2 segundos
    setInterval(checkPage, 2000);

})();
