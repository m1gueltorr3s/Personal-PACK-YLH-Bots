// ==UserScript==
// @name         Bot de YouLikeHits
// @namespace    https://github.com/m1gueltorr3s/Personal-PACK-YLH-Bots/
// @version      0.0.1
// @description  Automatiza interacciones en YouLikeHits de manera eficiente.
// @author       m1gueltorr3s
// @updateURL    
// @downloadUR
// @match        *://*.youlikehits.com/login.php
// @match        *://*.youlikehits.com/soundcloudplays.php*
// @match        *://*.youlikehits.com/websites.php*
// @match        *://*.youlikehits.com/viewwebsite.php*
// @match        *://*.youlikehits.com/youtubenew2.php*
// @match        *://*.youlikehits.com/bonuspoints.php*
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/gh/naptha/tesseract.js/dist/tesseract.min.js
// ==/UserScript==

(() => {
    // ** Sección de Inicialización **
    const $ = jQuery.noConflict(true); // Inicializa jQuery y evita conflictos
    const intervaloGlobal = 2000; // Intervalo de tiempo en milisegundos para el bucle principal

    // ** Función para resolver Captchas **
    const resolverCaptcha = (imagen, salida, idCaptcha, callback = () => {}) => {
        // Evitar múltiples instancias de resolución de captcha
        if (window[idCaptcha] === undefined) {
            window[idCaptcha] = true;
            const nota = agregarNotificacion(imagen, "Resolviendo el captcha..."); // Notificación de resolución de captcha
            Tesseract.recognize($(imagen).attr("src")).then(resultado => {
                let respuesta = resultado.text; // Obtener texto del captcha
                if (respuesta.length === 3) {
                    // Formatear respuesta si contiene '7'
                    if (respuesta.substr(1, 1) == 7) {
                        respuesta = respuesta.substr(0, 1) + "-" + respuesta.substr(2);
                    }
                    // Sustituir caracteres y evaluar la respuesta
                    respuesta = respuesta.replace(/x/g, "*").replace(/[} ]/g, "");
                    salida.val(eval(respuesta)); // Colocar respuesta en el campo
                    window[idCaptcha] = false; // Marcar como resuelto
                    eliminarNotificacion(nota); // Eliminar notificación
                    callback(); // Ejecutar callback si existe
                }
            });
        }
    };

    // ** Funciones de Notificación **
    const agregarNotificacion = (elemento, mensaje) => {
        // Agrega una notificación antes de un elemento específico
        const el = `<p style='color: red;'>Bot dice: <i>${mensaje}</i></p>`;
        const anterior = $(elemento).prev()[0];
        if (!anterior || !anterior.innerText.includes(mensaje)) {
            return $(el).insertBefore(elemento); // Insertar la notificación
        }
    };

    const eliminarNotificacion = (el) => {
        // Eliminar notificación si existe
        if (el !== undefined) el.remove();
    };

    // ** Función para generar un tiempo aleatorio **
    const segundosAleatorios = (min, max) => {
        // Genera un tiempo aleatorio entre min y max
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000; // Multiplica por 1000 para convertir a milisegundos
    };

    // ** Función para mostrar alertas una sola vez **
    const alertaUnaVez = (mensaje, id) => {
        const idLocal = id !== undefined ? id : mensaje; // Asignar id local
        if (!advertenciasMostradas.includes(idLocal)) {
            advertenciasMostradas.push(idLocal); // Almacenar id en el array
            console.log(mensaje); // Mostrar mensaje en consola
        }
    };

    // ** Variables Globales **
    let videoAnterior = ""; // Almacena el ID del video anterior
    let advertenciasMostradas = []; // Almacena las advertencias ya mostradas

    // ** Bucle Principal **
    const buclePrincipal = setInterval(() => {
        // ** Verificaciones de Estado **
        if ($("*:contains('503 Service Unavailable')").length) {
            console.log("¡Error del servidor! Reiniciando...");
            location.reload(); // Recargar página si hay error de servicio
        } else if ($("*:contains('not logged in!')").length) {
            window.location.href = "login.php"; // Redirigir a login si no está autenticado
        } else if ($("*:contains('Failed. You did not successfully solve the problem.')").length) {
            $("a:contains('Try Again')")[0].click(); // Intentar de nuevo si falla
        } else {
            // ** Manejo según la página actual **
            switch (document.location.pathname) {
                case "/login.php":
                    // Si estamos en la página de login
                    if (!$("input#password").val().length) 
                        agregarNotificacion("#username", "Considera guardar tus datos de inicio de sesión.");
                    const captcha = $("img[alt='Enter The Numbers']"); // Buscar captcha
                    if (captcha.length) 
                        resolverCaptcha(captcha[0], $("input[name='postcaptcha']"), "captcha_login"); // Resolver captcha
                    break;

                case "/bonuspoints.php":
                    // Manejo de la página de puntos bonus
                    if ($("body:contains('You have made ')").length && $("body:contains(' Hits out of ')").length) {
                        const retrasoRecarga = segundosAleatorios(60, 60 * 5); // Tiempo de recarga aleatorio
                        agregarNotificacion(".maintable", `No tienes suficientes puntos. Reiniciando en ${Math.round(retrasoRecarga / 1000 / 60)} minutos...`);
                        setTimeout(() => location.reload(), retrasoRecarga); // Recargar después del tiempo
                        clearInterval(buclePrincipal); // Detener el bucle principal
                    } else if ($(".buybutton").length) {
                        $(".buybutton")[0].click(); // Hacer clic en el botón de compra
                    }
                    break;

                case "/soundcloudplays.php":
                    // Manejo de la página de reproducciones de SoundCloud
                    if (!$(".maintable span[id*='count']").attr("style").includes("display:none;")) 
                        return agregarNotificacion(".maintable", "Música ya en reproducción...");
                    if ($(".followbutton").length) {
                        $(".followbutton").first().click(); // Hacer clic en el primer botón de seguir
                    } else {
                        console.log("No se encontró el botón de seguir."); // Mensaje si no se encuentra
                    }
                    break;

                case "/youtubenew2.php":
                    // Manejo de la página de YouTube
                    if ($('body:contains("failed")').length) location.reload(); // Recargar si hay error
                    if ($(".followbutton").length) {
                        // Obtener ID del video
                        let idVideo = () => $(".followbutton").first().parent().children("span[id*='count']").attr("id");
                        let killerPaciencia = (prev) => {
                            setTimeout(() => {
                                // Si el ID del video no ha cambiado, saltar el anuncio
                                if (idVideo() === prev) {
                                    $(".followbutton").parent().children("a:contains('Skip')").click();
                                    nuevaVentana.close();
                                }
                            }, 1000 * 135); // Tiempo de espera para saltar anuncio
                        };
                        if (idVideo() !== videoAnterior) {
                            videoAnterior = idVideo(); // Actualizar el ID del video anterior
                            if (window.eval("typeof(window.nuevaVentana) !== 'undefined'")) {
                                if (nuevaVentana.closed) {
                                    console.log("¡Viendo un video!");
                                    $(".followbutton")[0].click(); // Hacer clic para reproducir
                                    killerPaciencia(videoAnterior); // Llamar a la función de espera
                                }
                            } else {
                                console.log("¡Viendo un video!");
                                $(".followbutton")[0].click(); // Hacer clic para reproducir
                                killerPaciencia(videoAnterior); // Llamar a la función de espera
                            }
                        }
                    } else {
                        const captcha = $("img[src*='captchayt']"); // Buscar captcha en YouTube
                        if (captcha.length) 
                            resolverCaptcha(captcha[0], $("input[name='answer']"), "captcha_youtube", () => $("input[value='Submit']").first().click()); // Resolver captcha
                    }
                    break;
            }

            // ** Manejo de Navegación en Otras Páginas **
            GM.getValue("estado_pestaña_abierta", false).then(estado => {
                switch (document.location.pathname) {
                    case "/websites.php":
                        // Verificar si hay sitios web disponibles
                        if (J("*:contains('There are no Websites currently visitable for Points')").length) {
                            // No hay sitios disponibles
                            console.log("Todos los sitios han sido visitados. Recarga la página para comenzar de nuevo.");
                        } else {
                            if (!estado && window.eval("typeof(window.childWindow) !== 'undefined'")) {
                                if (!childWindow.closed) childWindow.close(); // Cerrar ventana si está abierta
                            } else if (estado && window.eval("typeof(window.childWindow) == 'undefined'")) {
                                console.log("No hay ventana hija abierta. Creando una nueva pestaña.");
                                estado = false; // Reiniciar estado
                            }
                            const botones = J(".followbutton:visible");
                            if (botones.length) {
                                if (!estado) {
                                    console.log("Configurando el estado de la pestaña a true...");
                                    GM.setValue('estado_pestaña_abierta', true).then(() => {
                                        console.log("Visitando una nueva página...");
                                        botones[0].onclick(); // Hacer clic en el primer botón visible
                                    });
                                }
                            } else {
                                console.log("¡No hay más botones! Solicitando más...");
                                if (window.eval("typeof(window.childWindow) !== 'undefined'") && childWindow.closed) 
                                    location.reload(); // Recargar si no hay más botones
                            }
                        }
                        break;
                }
            });
        }
    }, intervaloGlobal); // Ejecución del bucle principal a intervalos globales
})();

