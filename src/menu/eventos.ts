import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { IRepositorio } from "../interfaces/operaciones.js";
import { menuCrearDimension } from "./creacion.js";
import { pausa } from "./utilidades.js";

/**
 * Muestra un formulario para registrar un viaje interdimensional, actualizando
 * la ubicación del personaje y guardando el evento en el historial
 * @param gestor - El gestor del multiverso para registrar el viaje
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuRegistrarViaje(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const viaje = await prompts([
    { type: "text", name: "personaje", message: "ID del Personaje:" },
    { type: "text", name: "destino", message: "ID Dimensión Destino:" },
    { type: "text", name: "motivo", message: "Motivo del viaje:" },
  ]);

  try {
    gestor.registrarViaje(viaje.personaje, viaje.destino, viaje.motivo);
    await repositorio.guardar();
    console.log("Sistema: El viaje ha sido procesado y guardado.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

/**
 * Pide los datos por consola para desplegar un artefacto en una localización específica
 * @param gestor - El gestor del multiverso para realizar el despliegue
 */
export async function menuDesplegarArtefacto(gestor: GestorMultiverso): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id_artefacto", message: "ID del artefacto a desplegar:" },
    { type: "text", name: "id_localizacion", message: "ID de la localización destino:" }
  ]);
  
  if (!respuestas.id_artefacto || !respuestas.id_localizacion) {
    return;
  }

  try {
    gestor.despliegueArtefacto(respuestas.id_artefacto, respuestas.id_localizacion);
    console.log(`Sistema: Artefacto desplegado correctamente en la localización.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await pausa();
}

/**
 * Pide los datos por consola para neutralizar un artefacto desplegado 
 * y lo retira de su localización actual
 * @param gestor - El gestor del multiverso para realizar la neutralización
 */
export async function menuNeutralizarArtefacto(gestor: GestorMultiverso): Promise<void> {
  const respuestas = await prompts([
    { type: "text", name: "id_artefacto", message: "ID del artefacto a neutralizar (ej. ART-001):" },
    { type: "text", name: "id_localizacion", message: "ID de la localización donde está desplegado (ej. LOC-001):" }
  ]);

  if (!respuestas.id_artefacto || !respuestas.id_localizacion) {
    return;
  }

  try {
    gestor.neutralizarArtefacto(respuestas.id_artefacto, respuestas.id_localizacion);
    
    console.log(`Sistema: Artefacto ${respuestas.id_artefacto} neutralizado correctamente y retirado de la localización`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Simula un experimento o paradoja que tiene como consecuencia la creación
 * o destrucción de una dimensión
 * @param gestor - El gestor del multiverso para aplicar las consecuencias
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEjecutarExperimento(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { tipo } = await prompts({
    type: "select",
    name: "tipo",
    message: "¿Qué consecuencia catastrófica ha tenido el experimento/paradoja?",
    choices: [
      { title: "Destruir una dimensión existente", value: "destruir" },
      { title: "Crear una nueva dimensión", value: "crear" },
      { title: "Cancelar (Demasiado peligroso)", value: "cancelar" }
    ]
  });

  if (!tipo || tipo === "cancelar") {
    return;
  }

  if (tipo === "destruir") {
    const { id } = await prompts({ 
      type: "text", 
      name: "id", 
      message: "Introduce el ID de la dimensión que ha colapsado (ej. C-137):" 
    });

    if (id) {
      try {
        gestor.destruirDimension(id);
        await repositorio.guardar();
        console.log(`\n La dimensión ${id} ha colapsado y su estado ahora es 'Destruida'`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    }
  } else if (tipo === "crear") {
    console.log(`\n El experimento ha creado una nueva dimensión`);
    console.log("--- Introduce los datos de la NUEVA dimensión ---");
    
    await menuCrearDimension(gestor, repositorio);
  }

  await pausa();
}