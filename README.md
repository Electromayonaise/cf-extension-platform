# CF Practice Platform

Plataforma local para practicar problemas de Codeforces permitiendo
enviar soluciones directamente a Codeforces.

Este proyecto proporciona una interfaz para:

-   cargar problemas de Codeforces
-   escribir soluciones
-   enviar código directamente a Codeforces
-   recibir veredictos dentro de la plataforma

La plataforma está diseñada para funcionar junto con la extensión de
navegador:

https://github.com/Electromayonaise/cf-submit-extension

Sin la extensión, la plataforma no puede realizar envíos.

## Motivación

El flujo típico para practicar problemas de Codeforces suele ser:

1.  Abrir el problema en Codeforces
2.  Escribir el código localmente
3.  Copiar y pegar la solución
4.  Enviarla manualmente

Esta plataforma explora un flujo distinto:

1.  Cargar el problema dentro de la plataforma de práctica
2.  Escribir la solución
3.  Enviar directamente desde la plataforma
4.  Recibir el veredicto automáticamente

El objetivo es evaluar si **la integración directa de envíos a
Codeforces desde una plataforma externa es viable**.

## Arquitectura

El sistema está compuesto por tres componentes principales.

### 1. Plataforma local

Aplicación web construida con:

-   Node.js
-   Express
-   Frontend en JavaScript

Responsabilidades:

-   obtener los enunciados de problemas
-   mostrar los problemas
-   proporcionar un editor de código
-   enviar solicitudes de envío a la extensión
-   mostrar los veredictos

### 2. Extensión de navegador

Se encarga de toda la interacción con Codeforces:

-   abrir la página de envío
-   llenar el formulario
-   realizar el envío
-   obtener el veredicto

### 3. API de Codeforces

Se utiliza únicamente para consultar los veredictos.

Endpoint utilizado:

-   user.status

## Flujo de funcionamiento

1.  El usuario carga un problema usando su id de Codeforces.

2.  El servidor obtiene el enunciado del problema.

3.  El usuario escribe su solución en la plataforma.

4.  Cuando el usuario presiona submit:

    la plataforma envía

    CF_SUBMIT

    mediante `window.postMessage`.

5.  La extensión recibe el mensaje y realiza el envío.

6.  La extensión consulta la API de Codeforces hasta que el veredicto
    esté disponible.

7.  El veredicto se envía de vuelta a la plataforma y se muestra al
    usuario.

## Limitaciones

### 1. Dependencia de la extensión

Los envíos no pueden ejecutarse sin la extensión.

### 2. Dependencia del DOM de Codeforces

La extensión depende de la estructura actual de la página de envío.

### 3. Lista limitada de lenguajes

Actualmente la plataforma expone solo algunos lenguajes.

### 4. Retraso por consulta de API

Los veredictos se obtienen mediante consultas periódicas a la API.

### 5. Renderizado del enunciado

El enunciado se obtiene y se renderiza en la plataforma, pero pueden
existir diferencias menores respecto a la página oficial.

## Por qué este prototipo es importante

Este proyecto funciona como una **prueba de concepto** que demuestra
que:

-   una plataforma de práctica puede enviar soluciones a Codeforces
-   los veredictos pueden obtenerse automáticamente
-   los usuarios pueden practicar sin cambiar constantemente de página

Es importante destacar que este enfoque **no evita la infraestructura de
Codeforces**.\
En cambio, se integra con el flujo oficial del sitio utilizando la misma
interfaz que usaría un usuario.

## Análisis de factibilidad

A partir de los resultados del prototipo, integrar envíos a Codeforces
dentro de una plataforma externa parece factible.

Observaciones clave:

-   Codeforces permite envíos a través de su interfaz estándar sin
    verificación adicional cuando el usuario ya está autenticado.
-   Los veredictos pueden obtenerse mediante la API pública.
-   Las extensiones de navegador permiten conectar plataformas externas
    con el sitio oficial.

Sin embargo, una implementación en producción debería considerar:

-   detección más robusta del DOM
-   manejo más eficiente del veredicto
-   detección automática de lenguajes
-   mejor manejo de desafíos de Cloudflare

## Conclusión

El prototipo confirma que **es técnicamente viable enviar soluciones a
Codeforces directamente desde una plataforma externa**.

Aunque la implementación actual tiene limitaciones, la arquitectura
demuestra que es posible construir un entorno educativo completo capaz
de:

-   alojar conjuntos de problemas
-   integrarse con jueces externos
-   proporcionar retroalimentación automática similar a un concurso

Trabajos futuros podrían incluir:

-   soporte para múltiples jueces en línea
-   recomendación automática de problemas
-   seguimiento del progreso del usuario
-   simulación de concursos completos
