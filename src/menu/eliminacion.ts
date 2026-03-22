import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { IRepositorio } from "../interfaces/operaciones.js";
import { pausa } from "./utilidades.js";

/**
 * Pide el ID de un personaje por consola y lo elimina del sistema
 * @param gestor - El gestor del que se eliminará
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEliminarPersonaje(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID del personaje a ELIMINAR (ej. PER-001):"
  });

  if (!id) {
    return;
  }

  try {
    gestor.eliminarPersonaje(id);
    await repositorio.guardar();
    console.log(`Sistema: Personaje ${id} eliminado correctamente (borrado del multiverso)`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una dimensión por consola y la elimina del sistema
 * @param gestor - El gestor del que se eliminará
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEliminarDimension(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la dimensión a ELIMINAR (ej: C-137):"
  });

  if (!id) {
    return;
  }

  try {
    gestor.eliminarDimension(id);
    await repositorio.guardar();
    console.log(`Sistema: Dimensión ${id} eliminada correctamente (borrada del multiverso)`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una especie por consola y la elimina del sistema
 * @param gestor - El gestor del que se eliminará
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEliminarEspecie(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la especie a ELIMINAR (ej: ESP-001):"
  });

  if (!id) {
    return;
  }

  try {
    gestor.eliminarEspecie(id);
    await repositorio.guardar();
    console.log(`Sistema: Especie ${id} eliminada correctamente (borrada del multiverso)`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una localización por consola y la elimina del sistema
 * @param gestor - El gestor del que se eliminará
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEliminarLocalizacion(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la localización a ELIMINAR (ej: LOC-001):"
  });

  if (!id) {
    return;
  }

  try {
    gestor.eliminarLocalizacion(id);
    await repositorio.guardar();
    console.log(`Sistema: Localización ${id} eliminada correctamente (borrada del multiverso)`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de un artefacto por consola y lo elimina del sistema
 * @param gestor - El gestor del que se eliminará
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuEliminarArtefacto(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID del artefacto a ELIMINAR (ej: ART-001):"
  });

  if (!id) {
    return;
  }

  try {
    gestor.eliminarArtefacto(id);
    await repositorio.guardar();
    console.log(`Sistema: Artefacto ${id} eliminado correctamente (borrado del multiverso)`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}