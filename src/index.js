import express from "express";
import * as math from "mathjs";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: '*'
}));

function falsaPosicion(funcion, xi, xf, iteraciones, error_permisible) {
  let xr, error;
  let tabla = [];

  try {
    // Verificar si la raíz está en el intervalo
    if (funcion(xi) * funcion(xf) <= 0) {
      for (let i = 1; i <= iteraciones; i++) {
        xr = xf - (funcion(xf) * (xf - xi)) / (funcion(xf) - funcion(xi));
        error = Math.abs((xr - xi) / xr);

        tabla.push({
          Iteracion: i,
          xi: xi,
          xf: xf,
          "f(xi)": funcion(xi),
          "f(xf)": funcion(xf),
          xr: xr,
          "f(xr)": funcion(xr),
          Er: error,
        });

        if (error < error_permisible) {
          break;
        }

        if (funcion(xi) * funcion(xr) > 0) {
          xi = xr;
        } else {
          xf = xr;
        }
      }

      console.log("----- Método de Falsa Posición -----");
      console.log("Tabla de Iteraciones:");
      console.table(tabla);
      console.log(`La solución aproximada es: ${xr}`);
      console.log(`Encontrada en ${tabla.length} iteraciones.`);
      console.log(`Con un error de: ${error}%`);

      return {
        tabla,
        solucion: xr,
        iteraciones: tabla.length,
        error: error,
      };
    } else {
      console.log("No existe solución en ese intervalo.");
    }
  } catch (error) {
    console.log("Hubo un error:", error.message);
  }
}

function biseccion(funcion, xi, xf, iteraciones, error_permisible) {
  let tabla = [];

  try {
    // Verificar si la raíz está en el intervalo
    if (funcion(xi) * funcion(xf) <= 0) {
      let xr, error;

      for (let i = 1; i <= iteraciones; i++) {
        xr = (xi + xf) / 2;
        error = Math.abs((xr - xi) / xr);

        tabla.push({
          Iteracion: i,
          xi: xi,
          xf: xf,
          "f(xi)": funcion(xi),
          "f(xf)": funcion(xf),
          xr: xr,
          "f(xr)": funcion(xr),
          Er: error,
        });

        if (error < error_permisible) {
          break;
        }

        if (funcion(xi) * funcion(xr) > 0) {
          xi = xr;
        } else {
          xf = xr;
        }
      }

      console.log("----- Método de Bisección -----");
      console.log("Tabla de Iteraciones:");
      console.table(tabla);
      console.log(`La solución aproximada es: ${xr}`);
      console.log(`Encontrada en ${tabla.length} iteraciones.`);
      console.log(`Con un error de: ${error}%`);
      return {
        tabla,
        solucion: xr,
        iteraciones: tabla.length,
        error: error,
      };
    } else {
      console.log("No existe solución en ese intervalo.");
    }
  } catch (error) {
    console.log("Hubo un error:", error.message);
  }
}

function newtonRaphson(funcion, x0, iteraciones, error_permisible) {
  let tabla = [];

  let parse = math.parse(funcion);
  let funcionStr = parse.toString();
  let derivada = math.derivative(parse, "x").toString();

  let x1, error;

  try {
    for (let i = 1; i <= iteraciones; i++) {
      x1 = x0 - math.evaluate(funcionStr, { x: x0 }) / math.evaluate(derivada, { x: x0 });
      error = Math.abs((x1 - x0) / x1);

      tabla.push({
        Iteracion: i,
        x0: x0,
        "f(x0)": math.evaluate(funcionStr, { x: x0 }),
        "f'(x0)": math.evaluate(derivada, { x: x0 }),
        x1: x1,
        "f(x1)": math.evaluate(funcionStr, { x: x1 }),
        Er: error,
      });

      if (error < error_permisible) {
        break;
      }

      x0 = x1;
    }

    console.log("----- Método de Newton-Raphson -----");
    console.log("Tabla de Iteraciones:");
    console.table(tabla);
    console.log(`La solución aproximada es: ${x1}`);
    console.log(`Encontrada en ${tabla.length} iteraciones.`);
    console.log(`Con un error de: ${error * 100}%`);

    return {
      tabla,
      solucion: x1,
      iteraciones: tabla.length,
      error: error,
    };
  } catch (error) {
    console.log("Hubo un error:", error.message);
  }
}


function secante(funcion, x0, x1, iteraciones, error_permisible) {
  let tabla = [];

  let x2, error;

  try {
    for (let i = 1; i <= iteraciones; i++) {
      x2 = x1 - (funcion(x1) * (x1 - x0)) / (funcion(x1) - funcion(x0));
      error = Math.abs((x2 - x1) / x2);

      tabla.push({
        Iteracion: i,
        x0: x0,
        "f(x0)": funcion(x0),
        x1: x1,
        "f(x1)": funcion(x1),
        x2: x2,
        "f(x2)": funcion(x2),
        Er: error,
      });

      if (error < error_permisible) {
        break;
      }

      x0 = x1;
      x1 = x2;
    }

    console.log("----- Método de la Secante -----");
    console.log("Tabla de Iteraciones:");
    console.table(tabla);
    console.log(`La solución aproximada es: ${x2}`);
    console.log(`Encontrada en ${tabla.length} iteraciones.`);
    console.log(`Con un error de: ${error}%`);

    return {
      tabla,
      solucion: x2,
      iteraciones: tabla.length,
      error: error,
    };
  } catch (error) {
    console.log("Hubo un error:", error.message);
  }
}

app.post("/solve", (req, res) => {
  const { metodo, funcion, xi, xf, iteraciones, error_permisible } = req.body;

  let result;
  switch (metodo) {
    case "falsaPosicion":
      console.log(eval(`(${funcion})`));
      result = falsaPosicion(
        eval(`(${funcion})`),
        xi,
        xf,
        iteraciones,
        error_permisible
      );
      break;
    case "biseccion":
      result = biseccion(
        eval(`(${funcion})`),
        xi,
        xf,
        iteraciones,
        error_permisible
      );
      break;
    case "newtonRaphson":
      result = newtonRaphson(funcion, xi, iteraciones, error_permisible);
      break;
    case "secante":
      result = secante(
        eval(`(${funcion})`),
        xi,
        xf,
        iteraciones,
        error_permisible
      );
      break;
    default:
      result = "Método no válido";
      break;
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ejemplo de uso en local
// const funcion = (x) => - 1 * Math.pow(x, 3) + x + 1;
// const derivada = (x) => - 3 * Math.pow(x, 2) + 1;
// falsaPosicion(funcion, 1, 1.5, 15, 0.00001);
// biseccion(funcion, 1, 1.5, 15, 0.00001);
// newtonRaphson(funcion, derivada, 1, 15, 0.00001);
// secante(funcion, 1, 1.5, 15, 0.00001);
