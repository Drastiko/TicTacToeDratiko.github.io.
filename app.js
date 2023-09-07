document.addEventListener("DOMContentLoaded", function () {
    const btnX = document.getElementById("ficha1");
    const btnY = document.getElementById("ficha2");
    const tablero = document.getElementById("tablero");
    const celdas = [];
    let jugadorActivo = "";
    let juegoTerminado = false;

    btnX.addEventListener("click", function () {
        comenzarJuego("X");
    });

    btnY.addEventListener("click", function () {
        comenzarJuego("O");
    });

    function comenzarJuego(ficha) {
        if (!juegoTerminado || jugadorActivo === "") {
            jugadorActivo = ficha;
            iniciarTablero();
            if (jugadorActivo === "O") {
                setTimeout(algoritmoMaquinaMovimiento, 1000);
            }
        }
    }

    function iniciarTablero() {
        if (juegoTerminado) {
            return;
        }
        if (celdas.length === 0) {
            for (let i = 0; i < 3; i++) {
                const fila = document.createElement("div");
                fila.classList.add("fila");
                for (let j = 0; j < 3; j++) {
                    const celda = document.createElement("div");
                    celda.classList.add("celda");
                    celda.dataset.row = i;
                    celda.dataset.col = j;
                    fila.appendChild(celda);
                    celdas.push(celda);
                }
                tablero.appendChild(fila);
            }
        }
        habilitarCasillas(jugadorActivo);
    }

    function habilitarCasillas(jugador) {
        if (juegoTerminado) {
            celdas.forEach((celda) => {
                celda.classList.remove("clickable");
                celda.removeEventListener("click", manejarClickCelda);
            });
        } else {
            celdas.forEach((celda) => {
                if (!celda.textContent && jugadorActivo === jugador) {
                    celda.classList.add("clickable");
                    celda.addEventListener("click", manejarClickCelda);
                } else {
                    celda.classList.remove("clickable");
                    celda.removeEventListener("click", manejarClickCelda);
                }
            });
        }
    }

    function manejarClickCelda() {
        if (!this.textContent && jugadorActivo === "X") {
            this.textContent = jugadorActivo;
            this.classList.add("marcar");
            this.classList.add("player-move");
            verificarGanador();
            if (!juegoTerminado) {
                cambiarTurno();
                habilitarCasillas(jugadorActivo);
                if (jugadorActivo === "O") {
                    setTimeout(algoritmoMaquinaMovimiento, 1000);
                }
            }
        }
    }

    function cambiarTurno() {
        jugadorActivo = jugadorActivo === "X" ? "O" : "X";
        actualizarContenidoJuego(jugadorActivo);
    }

    function verificarGanador() {
        const combinacionesGanadoras = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let ganadorEncontrado = false;

        for (const combinacion of combinacionesGanadoras) {
            const [a, b, c] = combinacion;
            const celdaA = celdas[a];
            const celdaB = celdas[b];
            const celdaC = celdas[c];

            if (
                celdaA.textContent &&
                celdaA.textContent === celdaB.textContent &&
                celdaA.textContent === celdaC.textContent
            ) {
                ganadorEncontrado = true;
                mostrarResultado(`Jugador ${celdaA.textContent} gana!`);
                break;
            }
        }

        if (ganadorEncontrado) {
            juegoTerminado = true;
            deshabilitarCasillas();
        } else if (celdas.every((celda) => celda.textContent)) {
            mostrarResultado("Empate");
            juegoTerminado = true;
            deshabilitarCasillas();
        }
    }

    function deshabilitarCasillas() {
        celdas.forEach((celda) => {
            celda.classList.remove("clickable");
        });
    }

    function mostrarResultado(resultado) {
        const resultadoElemento = document.getElementById("ganador");
        resultadoElemento.textContent = resultado;
    }

    function actualizarContenidoJuego(jugador) {
        const jugadorActivoElemento = document.getElementById("jugador-activo");
        jugadorActivoElemento.textContent = jugador;
    }

    function algoritmoMaquinaMovimiento() {
        if (juegoTerminado || jugadorActivo === "X") {
            return;
        }

        const casillasDisponibles = celdas.filter((celda) => !celda.textContent);

        if (casillasDisponibles.length === 1) {
            const casillaUnica = casillasDisponibles[0];
            casillaUnica.textContent = "O";
            casillaUnica.classList.add("marcar");
            casillaUnica.classList.add("machine-move");
            verificarGanador();
            cambiarTurno();
            habilitarCasillas(jugadorActivo);
        } else {
            setTimeout(function () {
                const casillaAleatoria =
                    casillasDisponibles[
                        Math.floor(Math.random() * casillasDisponibles.length)
                    ];
                casillaAleatoria.textContent = "O";
                casillaAleatoria.classList.add("marcar");
                casillaAleatoria.classList.add("machine-move");
                verificarGanador();
                cambiarTurno();
                habilitarCasillas(jugadorActivo);
            }, 1000);
        }
    }

    comenzarJuego("X");
});
