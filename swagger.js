import {writeFileSync} from "node:fs"
import swaggerJSDoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi:'3.0.0', 
        info: {
        title: 'Booking API',
        version: '1.0.0',
        description: 'Booking Api'
       },
       servers: [
        {
            url: '/',
            description: 'Current server'
        }
       ]
    },
    apis: ['./src/routes/api-routes.js', './app.js']
};

const swaggerSpec = swaggerJSDoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');