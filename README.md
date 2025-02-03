# La nube

[Boletera](http://daquh13zx2ys8.cloudfront.net/)

# Amazon web services
  - Cloudfront
  - API Gateway
  - Lambda
  - S3

# Base de datos JSON
Se guarda en **data.json** en bucket **boleteradata**

```json
{
    "asientos_ocupados": [
        15,
        20,
        22
    ],
    "asientos": {
        "asiento_15": {
            "id": "OSsjU54655DnKIsklsSJkjs157sd6",
            "name": "Jose Eduardo Muñoz",
            "email": "joseeduardo@example.com"
        },
        "asiento_20": {
            "id": "c5be1b3f-613a-4d60-8036-63c7adbd6433",
            "name": "Manuel Antonio Gallardo",
            "email": "manuel@example.com"
        },
        "asiento_22": {
            "id": "fc37cb2e-1a8c-46c4-9bd8-bccfde244703",
            "name": "Jimena Garcia",
            "email": "jimenag@example.com"
        }
    }
}
```


# API Documentation

## Obtener asientos  ocupados

```http
GET /default/ HTTP/1.1
Host: hfxwfbvgsg.execute-api.us-east-1.amazonaws.com
```
### Respuesta en body

```json
{
  "asientos_ocupados": [15,20,22]
}
```
### Codigo lambda
```javascript
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "boleteradata";
const jsonKey = "data.json";


export const handler = async (event) => {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: jsonKey });
    const response = await s3.send(getObjectCommand);
    
    const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });

    const fileContent = await streamToString(response.Body);
    let data = JSON.parse(fileContent);
    
    const asientos_ocupados = {
      "asientos_ocupados": data.asientos_ocupados
    }

    return {
      statusCode: 200,

      body: JSON.stringify(asientos_ocupados),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
};

```

---

## Enviar un nuevo registro 

```http
POST /default/ HTTP/1.1
Host: hfxwfbvgsg.execute-api.us-east-1.amazonaws.com
Content-Type: application/json
Content-Length: 96

{
    "asiento": "asiento_20",
    "name": "Juan vidales",
    "email": "juan@example.com"
}
```
### Respuesta en body
```json
{
    "disponibilidad": false,
    "id": "ef87ec8a-e0e1-4705-ab26-068ce5286517"
}
```
En caso que no se encuentre el **id**  lo regresa vacio

### Codigo lambda
```javascript
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { randomUUID } from 'crypto';


const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "boleteradata";
const jsonKey = "data.json";


export const handler = async (event) => {
  let body = {};

  if (event.body) {
      body = JSON.parse(event.body);
  }

  const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: jsonKey });
  const response = await s3.send(getObjectCommand);
    
  const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });

  const fileContent = await streamToString(response.Body);
  let data = JSON.parse(fileContent);

  var registrer = (name, email, asiento) => {
    let intAsiento = parseInt(asiento.split("_")[1]);
    let body_respuesta = {disponibilidad : false, id:""}
      
    if (data.asientos_ocupados.includes(intAsiento)) {
      return body_respuesta
    }
    
    body_respuesta.id = randomUUID();
    
    data.asientos_ocupados.push(intAsiento);
      
    data.asientos[asiento] = {
      id: body_respuesta.id,
      name: name,
      email: email
    };
    
    return body_respuesta;
  }
    
  var { name, email, asiento } = body;
  
  const respuesta = registrer(name, email, asiento)

  const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: jsonKey,
      Body: JSON.stringify(data, null, 4),
      ContentType: "application/json"
    });

  await s3.send(putObjectCommand);

  return {
    statusCode: 200,
    body: JSON.stringify(respuesta),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
  };
};
```




## Peticicion para obtener el la informacion del ticket

```http
GET /default/getTicket?id=OSsjU54655DnKIsklsSJkjs157sd6 HTTP/1.1
Host: hfxwfbvgsg.execute-api.us-east-1.amazonaws.com
```

### Respuesta en body

```json
{
  "id": "OSsjU54655DnKIsklsSJkjs157sd6",
  "name":"Jose Eduardo Muñoz",
  "email":"joseeduardo@gmail.com"
  "asiento":"asiento_15",
}
```
### Codigo lambda
```javascript
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "boleteradata";
const jsonKey = "data.json";


export const handler = async (event) => {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: jsonKey });
    const response = await s3.send(getObjectCommand);
    
    const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });

    const fileContent = await streamToString(response.Body);
    let data = JSON.parse(fileContent);

    const queryParams = event.queryStringParameters || {};

    const respuesta = (id) => {
        if (!id) {
            return event.queryStringParameters;
        }

        for (let asiento in data.asientos) {
            if (data.asientos[asiento].id === id) {
                return {
                    id: data.asientos[asiento].id,
                    name: data.asientos[asiento].name,
                    email: data.asientos[asiento].email,
                    asiento
                };
            }
        }

        return { id: `${id} no encontrado` }; 
    };

    const req = respuesta(queryParams.id);

    
    return {
      statusCode: 200,
      body: JSON.stringify(req),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
};
```
