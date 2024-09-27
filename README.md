# API de Métodos Numéricos

Este proyecto es una API REST que implementa varios métodos numéricos para la resolución de ecuaciones no lineales. Desarrollado como parte de la asignatura "Matemáticas para Ingeniería 2", esta API permite resolver ecuaciones utilizando los métodos de Falsa Posición, Bisección, Newton-Raphson y Secante.

## Descripción

La API ofrece un endpoint `/solve` que acepta parámetros para especificar el método numérico a utilizar y los datos necesarios para la resolución. Los métodos implementados son:

1. Falsa Posición
2. Bisección
3. Newton-Raphson
4. Secante

Cada método retorna una tabla de iteraciones, la solución aproximada, el número de iteraciones realizadas y el error final.

## Requisitos

- Node.js
- npm (Node Package Manager)
- Dependencias:
  - express
  - mathjs
  - cors

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/betooxx-dev/metnum-backend.git
   ```
2. Navega al directorio del proyecto:
   ```
   cd metnum-backend
   ```
3. Instala las dependencias:
   ```
   npm install
   ```

## Uso

1. Inicia el servidor:
   ```
   npm run dev
   ```
2. El servidor se iniciará en `http://localhost:3000`

3. Realiza una petición POST a `http://localhost:3000/solve` con un cuerpo JSON que incluya:
   - `metodo`: String que especifica el método a usar ("falsaPosicion", "biseccion", "newtonRaphson", "secante")
   - `funcion`: String que representa la función a resolver
   - `xi`: Valor inicial (o límite inferior para algunos métodos)
   - `xf`: Valor final (o límite superior para algunos métodos)
   - `iteraciones`: Número máximo de iteraciones
   - `error_permisible`: Error máximo permitido

Ejemplo de cuerpo de la petición:
```json
{
  "metodo": "falsaPosicion",
  "funcion": "(x) => -1 * Math.pow(x, 3) + x + 1",
  "xi": 1,
  "xf": 1.5,
  "iteraciones": 15,
  "error_permisible": 0.00001
}
```

## Estructura del código

- El servidor se configura usando Express.js
- Cada método numérico está implementado como una función separada
- Se utiliza la biblioteca `mathjs` para el manejo de expresiones matemáticas
- CORS está habilitado para permitir peticiones desde cualquier origen

## Notas

- Este proyecto es una herramienta educativa para entender y aplicar métodos numéricos en la resolución de ecuaciones no lineales.
- La API está diseñada para ser utilizada en un entorno de desarrollo y no debe ser desplegada en producción sin las medidas de seguridad adecuadas.
