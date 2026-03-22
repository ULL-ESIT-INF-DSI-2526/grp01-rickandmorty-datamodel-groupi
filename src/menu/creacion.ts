import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { IRepositorio } from "../interfaces/operaciones.js";
import { Dimension, Estado } from "../entidades/dimension.js";
import { Personaje } from "../entidades/personaje.js";
import { Especie } from "../entidades/especie.js";
import { Localizacion } from "../entidades/localizacion.js";
import { Artefacto } from "../entidades/artefacto.js";
import { pausa } from "./utilidades.js";

/**
 * Muestra un formulario para registrar una nueva Dimensión. Si el usuario completa el proceso, guarda la dimensión
 * @param gestor - El gestor donde se añadirá
 * @param repositorio - El sistema para guardar en el JSON
 */
export async function menuCrearDimension(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id", message: "ID (Ej: C-137):" },
    { type: "text", name: "nombre", message: "Nombre:" },
    { type: "select", name: "estado", message: "Estado:", choices: [
        { title: "Activa", value: "Activa" },
        { title: "Destruida", value: "Destruida" },
        { title: "En cuarentena", value: "En cuarentena" },
      ],
    },
    { type: "number", name: "nivel_tecnologico", message: "Nivel Tecnológico (1-10):" },
    { type: "text", name: "descripcion", message: "Descripción:" },
  ]);

  // Si el usuario cancela (Ctrl+C), volvemos al menú
  if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
    return;
  }

  try {
    const nueva = new Dimension(respuestas.id, respuestas.nombre, respuestas.estado as Estado, respuestas.nivel_tecnologico, respuestas.descripcion);
    
    gestor.crearDimension(nueva);
    await repositorio.guardar();
    
    console.log("Sistema: Dimensión guardada.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await pausa();
}

/**
 * Muestra un formulario para crear a un nuevo Personaje. Si el usuario completa el proceso, guarda el personaje
 * @param gestor - El gestor donde se añadirá
 * @param repositorio - El sistema para guardar en el JSON
 */
export async function menuCrearPersonaje(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id", message: "ID (PER-XXX):" },
    { type: "text", name: "nombre", message: "Nombre:" },
    { type: "text", name: "id_especie", message: "ID Especie (ESP-XXX):" },
    { type: "text", name: "id_dimension", message: "ID Dimensión Origen:" },
    { type: "text", name: "estado", message: "Estado (Vivo, Muerto, etc.):" },
    { type: "text", name: "afiliacion", message: "Afiliación:" },
    { type: "number", name: "nivel_inteligencia", message: "Inteligencia (1-10):", min: 1, max: 10 },
    { type: "text", name: "descripcion", message: "Descripción:" },
  ]);

  if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
    return;
  }

  try {
    const nuevo = new Personaje(respuestas.id, respuestas.nombre, respuestas.id_especie, respuestas.id_dimension, respuestas.estado, respuestas.afiliacion, respuestas.nivel_inteligencia, respuestas.descripcion);
    
    gestor.crearPersonaje(nuevo);
    await repositorio.guardar();
    
    console.log("Sistema: Personaje registrado correctamente.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Muestra un formulario para crear una nueva Especie. Si el usuario completa el proceso, guarda la especie
 * @param gestor - El gestor donde se añadirá
 * @param repositorio - El sistema para guardar en el JSON
 */
export async function menuCrearEspecie(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id", message: "ID (ESP-XXX):" },
    { type: "text", name: "nombre", message: "Nombre:" },
    { type: "text", name: "id_origen", message: "ID Origen (Dim/Loc):" },
    { type: "text", name: "tipo", message: "Tipo (Humanoide, Alien, etc.):" },
    { type: "number", name: "esperanza_de_vida", message: "Esperanza de vida (años):" },
    { type: "text", name: "descripcion", message: "Descripción:" },
  ]);

  if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
    return;
  }

  try {
    const nuevaEspecie = new Especie(respuestas.id, respuestas.nombre, respuestas.id_origen, respuestas.tipo, respuestas.esperanza_de_vida, respuestas.descripcion);
    
    gestor.crearEspecie(nuevaEspecie);
    await repositorio.guardar();
    
    console.log("Sistema: Especie registrada correctamente.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await pausa();
}

/**
 * Muestra un formulario para crear una nueva Localización. Si el usuario completa el proceso, guarda la localización
 * @param gestor - El gestor donde se añadirá
 * @param repositorio - El sistema para guardar en el JSON
 */
export async function menuCrearLocalizacion(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id", message: "ID (LOC-XXX):" },
    { type: "text", name: "nombre", message: "Nombre:" },
    { type: "text", name: "tipo", message: "Tipo:" },
    { type: "text", name: "id_dimension", message: "ID Dimensión:" },
    { type: "number", name: "poblacion", message: "Población:" },
    { type: "text", name: "descripcion", message: "Descripción:" },
  ]);

  if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
    return;
  }

  try {
    const nuevaLoc = new Localizacion(respuestas.id, respuestas.nombre, respuestas.tipo, respuestas.id_dimension, respuestas.poblacion, respuestas.descripcion);
    
    gestor.crearLocalizacion(nuevaLoc);
    await repositorio.guardar();
    
    console.log("Sistema: Localización cartografiada.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await pausa();
}

/**
 * Muestra un formulario para registrar un nuevo Artefacto inventado. Si el usuario completa el proceso, guarda el artefacto
 * @param gestor - El gestor donde se añadirá
 * @param repositorio - El sistema para guardar en el JSON
 */
export async function menuCrearArtefacto(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id", message: "ID (ART-XXX):" },
    { type: "text", name: "nombre", message: "Nombre del invento:" },
    { type: "text", name: "id_inventor", message: "ID del Inventor:" },
    { type: "text", name: "tipo", message: "Tipo de tecnología:" },
    { type: "number", name: "nivel_peligrosidad", message: "Peligrosidad (1-10):" },
    { type: "text", name: "descripcion", message: "Descripción:" },
  ]);

  if (Object.keys(respuestas).length === 0 || respuestas.id === undefined) {
    return;
  }

  try {
    const nuevoArt = new Artefacto(respuestas.id, respuestas.nombre, respuestas.id_inventor, respuestas.tipo, respuestas.nivel_peligrosidad, respuestas.descripcion);
    
    gestor.crearArtefacto(nuevoArt);
    await repositorio.guardar();
    
    console.log("Sistema: Artefacto registrado en el inventario de Rick.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await pausa();
}