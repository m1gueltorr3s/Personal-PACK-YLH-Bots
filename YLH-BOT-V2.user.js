// ==UserScript==
// @name         MOTHERFUCKER BOT YLH
// @namespace    https://github.com/m1gueltorr3s/Personal-PACK-YLH-Bots/
// @version      1.4
// @description  Monitorea y maneja ventanas en YouLikeHits y cierra ventanas emergentes de StayFocusd
// @author       m1gueltorr3s
// @updateURL    https://github.com/m1gueltorr3s/Personal-PACK-YLH-Bots/raw/refs/heads/PRINCIPAL/MOTHERFUCKER-YLH.user.js
// @downloadUR   https://github.com/m1gueltorr3s/Personal-PACK-YLH-Bots/raw/refs/heads/PRINCIPAL/MOTHERFUCKER-YLH.user.js
// @match        https://www.youlikehits.com/viewwebsite.php*
// @match        https://www.youlikehits.com/youtubenew2.php
// @match        https://www.youlikehits.com/websites.php
// @match        https://www.stayfocusd.com/blocked*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // ================================
    // Sección 1: Auto-cierre en YouLikeHits
    // ================================
    (function() {
        'use strict';

        // Verifica si estamos en una página de "viewwebsite"
        const currentUrl = window.location.href;
        if (currentUrl.includes("viewwebsite.php")) {

            // Crear un recuadro para mostrar el temporizador
            const timerBox = document.createElement("div");
            timerBox.style.position = "fixed";
            timerBox.style.bottom = "10px";
            timerBox.style.right = "10px";
            timerBox.style.padding = "10px";
            timerBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            timerBox.style.color = "white";
            timerBox.style.fontSize = "14px";
            timerBox.style.borderRadius = "5px";
            timerBox.style.zIndex = "9999";
            timerBox.innerText = "Returning in 30 seconds";

            // Agregar el recuadro al cuerpo del documento
            document.body.appendChild(timerBox);

            // Configurar el temporizador de cuenta regresiva
            let timeLeft = 30;
            const countdown = setInterval(() => {
                timeLeft -= 1;
                timerBox.innerText = `Returning in ${timeLeft} seconds`;

                // Regresa a la página anterior y cierra la pestaña cuando el tiempo llegue a 0
                if (timeLeft <= 0) {
                    clearInterval(countdown); // Detiene el temporizador

                    // Regresa a la página anterior en el historial
                    history.back();

                    // Cierra la pestaña después de un breve retraso
                    setTimeout(() => window.close(), 1000);
                }
            }, 1000); // Actualiza cada segundo
        }

    })();


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ================================
    // Sección 2: Actualizar página YouLikeHits al detectar texto
    // ================================
    function checkYouLikeHitsTextUpdate() {
        const targetTexts = [
            "There are no videos available to view at this time. Try coming back or refreshing.",
            "YouTube Limit\nYou have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 15 minutes until you can do Views again.",
            "There are no Websites currently visitable for Points.",
            "You have hit your Views Limit per 15 minutes. This limit is in place to ensure the best possible experience. You can still use YouTube Likes/Subscribers sections but you must wait 2 minutes until you can do Views again."
        ];

        for (let text of targetTexts) {
            if (document.body.textContent.includes(text)) {
                // Si encuentra uno de los textos, actualiza la página automáticamente
                location.reload();
                break;
            }
        }
    }

    // Monitorea el contenido de YouLikeHits cada 1.5 segundos
    setInterval(checkYouLikeHitsTextUpdate, 1500);

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // ================================
    // Sección 3: Cerrar ventanas emergentes de StayFocusd
    // ================================
    function closeStayFocusdWindows() {
        const currentUrl = window.location.href;

        // Verifica si la URL coincide con la de StayFocusd
        if (currentUrl.includes("https://www.stayfocusd.com/blocked")) {
            // Intenta cerrar la ventana actual
            window.close();
        }
    }

    // Usar un observador de mutaciones para detectar nuevas ventanas emergentes en StayFocusd
    const stayFocusdObserver = new MutationObserver(closeStayFocusdWindows);
    stayFocusdObserver.observe(document.body, { childList: true, subtree: true });

    // Ejecuta la función para cerrar ventanas emergentes al cargar
    closeStayFocusdWindows();

})();
