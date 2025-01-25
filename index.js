const mapa = document.getElementById('mapa_asientos');
const asiento_seleccionado = document.getElementById('asiento_seleccionado');

const filas = 5;
const columnas = 10;
 
fetch("http://localhost:3001/aplicacion")
    .then(response => response.json())
    .then((data)=>{
        console.log(data)
        var asientos_ocupados = data.asientos_ocupados;

        for (let i = 1; i <= filas * columnas; i++) {
            const asiento = document.createElement('div');
            asiento.classList.add('asiento');
            asiento.textContent = i;
        
            if (asientos_ocupados.includes(i)) {
                asiento.classList.add('rojo');
            } else {
                asiento.classList.add('verde');
                asiento.addEventListener('click', () => {
                    if (!asiento.classList.contains('rojo')) {
                        document.querySelectorAll('.asiento.amarillo').forEach(selected => {
                            selected.classList.remove('amarillo');
                            selected.classList.add('verde');
                        });
                        asiento.classList.add('amarillo');
                        asiento.classList.remove('verde');
                        asiento_seleccionado.value = `Asiento ${i}`;
                    }
                });
            }
        
            mapa.appendChild(asiento);
        }
    })



document.getElementById('formulario').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const asient_selecc = asiento_seleccionado.value;

    if (asient_selecc) {
        alert(`¡Gracias ${name}! Tu asiento (${selectedSeat}) ha sido reservado con éxito. Confirmación enviada a ${email}.`);
        selectedSeatInput.value = '';
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        const selectedSeatElement = document.querySelector('.asiento.amarillo');
        selectedSeatElement.classList.add('rojo');
        selectedSeatElement.classList.remove('amarillo');
    } else {
        alert('Por favor selecciona un asiento antes de continuar.');
    }
});