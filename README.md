# Universo de Rick y Morty. Primer Trabajo en Grupo.

### Grupo I: Yoel Sánchez Cruz, Tayri Amador Guillén, Alejandro Pérez Andrada

Hemos hecho uso de los módulos `prompts` y `Lowdb` para implementar un simulador funcional del universo de Rick y Morty.
Otras herramientas que utilizamos:

 - `TSDoc` para la documentación del código. 
 - `Vitest` para implementar las pruebas unitarias.
 - `Coveralls` para comprobar el cubrimiento de nuestros tests.
 - `Code Quality` una nueva herramienta de GitHub para evitar el uso de SonarQube para medir la calidad de nuestro código.

## Contenido de nuestro universo

#### Dimensiones
Representan los diferentes universos.

- Un ID único.

- Nombre.

- Estado.

- Nivel tecnológico.

- Descripción.

#### Personajes

Representan a los habitantes del universo. Tienen atributos que permiten identificarlos, como:

- Un ID único.

- Nombre.

- Especie.

- Dimensión de origen.

- Estado.

- Afiliación.

- Nivel de inteligencia.

- Descripción.

#### Especies

Clasifiación biológica de los personajes. Cuentan con los siguientes atributos:

- Un ID único.

- Nombre.

- Origen.

- Tipo.

- Esperanza de vida media.

- Descripción.

#### Localizaciones

Puntos concretos dentro de las dimensiones. Cuentan con los siguientes atributos:

- Un ID único.

- Nombre.

- Tipo.

- Dimensión.

- Población aproximada.

- Descripción.

#### Artefactos

Inventos tecnológicos creados por personajes. Cuentan con los siguientes atributos:

- Un ID único.

- Nombre.

- Inventor.

- Tipo.

- Nivel de peligrosidad.

- Descripción.

## Funcionamiento

Nuestro sistema nos permite realizar las siguientes funciones:

- Añadir, eliminar y modificar las dimensiones, personajes, especies, localizaciones y artefactos

- Consultar personajes por nombre, especie, afiliación, estado o dimensión de origen, y ordenarlos por nombre o nivel de inteligencia de forma ascendente o descendente.

- Consultar localizaciones por nombre, tipo o dimensión.

- Consultar inventos por nombre, tipo, inventor o nivel de peligrosidad.

- Localizar todas las versiones alternativas de un personaje concreto a través de las distintas dimensiones registradas.

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2526/grp01-rickandmorty-datamodel-groupi/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2526/grp01-rickandmorty-datamodel-groupi?branch=main)

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/U8NqX9JL)
