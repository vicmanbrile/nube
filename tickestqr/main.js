const qrContainer = document.getElementById('qrContainer');


const ticketInfo = "Asiento: A1\nNombre: Juan Perez\nCorreo: juan.perez@example.com";


qrContainer.innerHTML = '';


new QRCode(qrContainer, {
  text: ticketInfo,
  width: 200,
  height: 200,
});