# Plan de Pruebas de Software - NextLevel

**Autores:**
* Angel Ivan Toro Caicedo
* Franklin Esneider Cordoba De La Cruz
* Vanya Catalina Portilla Sanchez

**Docente:**
Luis Carlos Jurado

**Institución:**
Institución Universitaria del Putumayo – Uniputumayo  
Facultad de Ingeniería y Ciencias Básicas  
Programa de Desarrollo de Software  
2026

---

## Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Descripción General del Sistema](#2-descripción-general-del-sistema)
3. [Alcance de las Pruebas](#3-alcance-de-las-pruebas)
4. [Casos de Prueba Definidos](#4-casos-de-prueba-definidos)
    *   4.1 [Pruebas Unitarias](#41-pruebas-unitarias)
    *   4.2 [Pruebas de Integración](#42-pruebas-de-integración)
    *   4.3 [Pruebas de Sistema](#43-pruebas-de-sistema)
5. [Estrategia de Pruebas](#5-estrategia-de-pruebas)
6. [Criterios de Aceptación y Rechazo](#6-criterios-de-aceptación-y-rechazo)
7. [Entregables](#7-entregables)
8. [Entorno de Pruebas](#8-entorno-de-pruebas)

---

## 1. Introducción

El presente documento tiene como objetivo establecer la estrategia, los recursos y el cronograma para la ejecución de las pruebas de software del proyecto **NextLevel**. Este plan busca asegurar la calidad del producto final, verificando que las funcionalidades críticas de la tienda web de hardware y servicios operen de manera correcta, segura y eficiente antes de su despliegue en producción.

La validación se centrará en garantizar una experiencia de usuario fluida tanto para los clientes (navegación, compra, gestión de cuenta) como para los administradores (gestión de catálogo, inventario y pedidos).

## 2. Descripción General del Sistema

**NextLevel** es una plataforma web de comercio electrónico especializada en la venta de componentes de hardware para computadoras y la prestación de servicios técnicos y de mantenimiento. El sistema está diseñado para ofrecer dos experiencias principales:

*   **Para el Cliente:** Un entorno intuitivo donde pueden explorar un catálogo de productos detallado, filtrar por categorías, gestionar un carrito de compras, realizar pagos seguros (integración con Stripe) y agendar citas para servicios técnicos.
*   **Para el Administrador:** Un panel de control robusto que permite la gestión integral del negocio, incluyendo la administración de usuarios, roles, productos, categorías, inventario y el seguimiento de órdenes y citas.

El sistema está construido con una arquitectura moderna, utilizando **Node.js y Express** para el backend y **React** para el frontend, garantizando rendimiento y escalabilidad.

## 3. Alcance de las Pruebas

Las pruebas abarcarán los módulos críticos del sistema para asegurar la integridad de los datos y la funcionalidad de los procesos de negocio. Se validará desde la lógica más pequeña hasta el flujo completo del usuario.

## 4. Casos de Prueba Definidos

A continuación, se detallan los casos de prueba específicos seleccionados para este plan, divididos por nivel de prueba.

### 4.1. Pruebas Unitarias
Estas pruebas verifican el correcto funcionamiento de fragmentos de código aislados, como funciones o métodos específicos.

**Prueba U-01: Validación de Formato de Correo Electrónico**
*   **Objetivo:** Asegurar que el sistema solo acepte correos electrónicos con un formato válido durante el registro o login.
*   **Descripción:** Se probará la función de validación enviando cadenas de texto sin "@", sin dominio o con caracteres prohibidos. La función debe retornar "falso" para formatos inválidos y "verdadero" para formatos correctos.
*   **Alcance:** Módulo de validación de usuarios (Backend/Frontend).

**Prueba U-02: Cálculo de Total del Carrito**
*   **Objetivo:** Verificar que la lógica matemática para sumar el costo de los productos sea exacta.
*   **Descripción:** Se enviará a la función de cálculo un arreglo de productos con precio y cantidad. El resultado debe ser la suma exacta de (Precio Unitario * Cantidad) para todos los ítems.
*   **Alcance:** Lógica de negocio del Carrito de Compras.

**Prueba U-03: Verificación de Disponibilidad de Stock**
*   **Objetivo:** Confirmar que la función de inventario impide seleccionar más productos de los existentes.
*   **Descripción:** Se invocará la función de comprobación de stock solicitando una cantidad mayor a la disponible en la base de datos simulada. La función debe retornar un error o indicador de "Stock Insuficiente".
*   **Alcance:** Controlador de Inventario/Productos.

### 4.2. Pruebas de Integración
Estas pruebas verifican que los diferentes módulos o componentes del sistema (Frontend, Backend, Base de Datos) se comuniquen correctamente entre sí.

**Prueba I-01: Autenticación de Usuario (Frontend ↔ Backend ↔ BD)**
*   **Objetivo:** Validar que el flujo de inicio de sesión conecta correctamente la interfaz de usuario con el servidor y la base de datos.
*   **Descripción:** El usuario ingresa credenciales en el formulario de React. Se verifica que la solicitud llegue al endpoint de Express, este consulte la base de datos, verifique el hash de la contraseña y devuelva un token de sesión válido al Frontend.
*   **Alcance:** Módulo de Login, API y Base de Datos.

**Prueba I-02: Carga de Catálogo de Productos**
*   **Objetivo:** Asegurar que la información almacenada en la base de datos se visualice correctamente en la tienda.
*   **Descripción:** Al cargar la página de "Tienda", el Frontend solicita la lista de productos. Se verifica que el Backend recupere los datos (nombre, precio, imagen) de la base de datos y que estos se rendericen correctamente en las tarjetas de producto de la interfaz.
*   **Alcance:** Componentes de UI de Productos y API de Catálogo.

### 4.3. Pruebas de Sistema
Estas pruebas validan el comportamiento del sistema completo, simulando la interacción real de un usuario de principio a fin.

**Prueba S-01: Flujo Completo de Compra**
*   **Objetivo:** Verificar que un cliente puede realizar una compra exitosa desde la selección del producto hasta la confirmación.
*   **Descripción:**
    1.  El usuario inicia sesión.
    2.  Busca un producto y lo agrega al carrito.
    3.  Procede al checkout e ingresa datos de envío.
    4.  Simula el pago exitoso.
    5.  El sistema debe: descontar el stock, crear la orden en base de datos, mostrar la confirmación en pantalla y enviar el resumen al historial del usuario.
*   **Alcance:** Todo el ecosistema de la aplicación (Frontend, Backend, Base de Datos, Pasarela de Pago simulada).

## 5. Estrategia de Pruebas

Se aplicará un enfoque híbrido de pruebas manuales y automatizadas. Las pruebas unitarias serán ejecutadas principalmente por el equipo de desarrollo durante la codificación, mientras que las pruebas de integración y sistema serán realizadas por el equipo de QA en un entorno controlado (Staging) antes del lanzamiento.

## 6. Criterios de Aceptación y Rechazo

### Criterios de Aceptación
El software será aceptado para despliegue cuando:
*   El 100% de los casos de prueba de severidad **Crítica** hayan sido aprobados.
*   No existan defectos de prioridad **Alta** abiertos.
*   La interfaz de usuario sea consistente en los navegadores definidos.

### Criterios de Suspensión (Rechazo)
Las pruebas se detendrán si:
*   Existen fallos bloqueantes que impiden el inicio de sesión o la carga de la página principal.
*   La inestabilidad del servidor impide la ejecución continua de las pruebas.

## 7. Entregables

Al finalizar el ciclo de pruebas, se generarán los siguientes documentos:
1.  **Plan de Pruebas Actualizado:** Este documento con revisiones finales.
2.  **Matriz de Casos de Prueba:** Detalle paso a paso de cada prueba ejecutada.
3.  **Reporte de Defectos (Bug Report):** Lista de errores encontrados, su severidad y estado de corrección.
4.  **Informe de Cierre (Sign-off):** Resumen ejecutivo indicando si el software es apto para producción.

## 8. Entorno de Pruebas

### Hardware y Software Requerido
*   **Navegadores:** Google Chrome (versión más reciente), Mozilla Firefox, Microsoft Edge.
*   **Dispositivos:** PC de escritorio/Laptop y pruebas de responsividad en dispositivos móviles.
*   **Herramientas de Gestión:** Jira o Trello para seguimiento de errores.
*   **Herramientas Técnicas:** Postman (para pruebas de API), Herramientas de desarrollo del navegador (DevTools).
