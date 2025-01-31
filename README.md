# La nube

[Boletera](http://daquh13zx2ys8.cloudfront.net/)


### Ejemplos de JSON intercabio

Lo que envia API Gateway al index.html para renderizar
```json
{
  "asientos_ocupados": [1,45,32,11]
}
```

Lo que la pagina va a enviar en POST del formulario
```json
{
  "name":"Jose Eduardo Muñoz",
  "email":"joseeduardo@gmail.com",
  "asiento": 15
}
```
Posteriormente se va a redirigir para la pagina con su QR acceso

Lo manera que Lambda va a procesar y guardar los datos
```json
{
  "asientos":[
    {
      "id": "OSsjU54655DnKIsklsSJkjs157sd6",
      "numero":15,
      "name":"Jose Eduardo Muñoz",
      "email":"joseeduardo@gmail.com"
    }
  ]
}
```

Lo que API Gateway va enviar para crear el codigo QR 
```json
{
    "id": "OSsjU54655DnKIsklsSJkjs157sd6",
    "numero":15,
    "name":"Jose Eduardo Muñoz",
    "email":"joseeduardo@gmail.com"
}
```
