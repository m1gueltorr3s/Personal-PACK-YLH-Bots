// ==UserScript==
// @name         Cerrar ventanas emergentes de StayFocusd
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Cierra todas las ventanas emergentes de StayFocusd inmediatamente si detecta el enlace de YT
// @author       Miguel
// @match        https://www.stayfocusd.com/blocked*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Función para cerrar ventanas emergentes con URLs específicas
    function closeStayFocusdWindows() {
        // Verificamos todas las ventanas abiertas
        const windows = window.open('', '_self');
        if (windows) {
            // Si la URL de la ventana coincide con el patrón, la cerramos
            if (windows.location.href.includes("https://www.stayfocusd.com/blocked")) {
                windows.close();
            }
        }
    }

    // Ejecutamos la función inmediatamente
    closeStayFocusdWindows();

    // También podemos usar un observador de mutaciones para detectar nuevas ventanas emergentes
    const observer = new MutationObserver(closeStayFocusdWindows);
    observer.observe(document, { childList: true, subtree: true });

})();
