import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { IRepositorio } from "../interfaces/operaciones.js";
import { pausa } from "./utilidades.js";

/**
 * Pide el ID de un personaje, muestra sus datos actuales y permite modificarlos
 * @param gestor - El gestor donde se buscará y modificará el personaje
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuModificarPersonaje(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID del personaje a MODIFICAR (ej. PER-001):"
  });

  if (!id) {
    return;
  }

  const actual = gestor.personajes.find(per => per.id === id);
  
  if (!actual) {
    console.log(`Sistema: No se encontró ningún personaje con el ID ${id}`);
    await pausa();
    return;
  }

  const respuestas = await prompts([
    { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
    { type: "text", name: "id_especie", message: "ID Especie:", initial: actual.id_especie },
    { type: "text", name: "id_dimension", message: "ID Dimensión:", initial: actual.id_dimension },
    { type: "text", name: "estado", message: "Estado:", initial: actual.estado },
    { type: "text", name: "afiliacion", message: "Afiliación:", initial: actual.afiliacion },
    { type: "number", name: "nivel_inteligencia", message: "Inteligencia (1-10):", min: 1, max: 10, initial: actual.nivel_inteligencia },
    { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
  ]);

  if (Object.keys(respuestas).length === 0) {
    return;
  }

  try {
    gestor.modificarPersonaje(id, respuestas);
    await repositorio.guardar();
    console.log(`Sistema: Personaje ${id} modificado y guardado correctamente.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una dimensión, muestra sus datos actuales y permite modificarlos
 * @param gestor - El gestor donde se buscará y modificará la dimensión
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuModificarDimension(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la dimensión a MODIFICAR (ej. C-137):"
  });

  if (!id) {
    return;
  }

  const actual = gestor.dimensiones.find(dim => dim.id === id);
  
  if (!actual) {
    console.log(`Sistema: No se encontró ninguna dimensión con el ID ${id}`);
    await pausa();
    return;
  }

  const respuestas = await prompts([
    { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
    { type: "text", name: "estado", message: "Estado:", initial: actual.estado },
    { type: "number", name: "nivel_tecnologico", message: "Tecnología (1-10):", min: 1, max: 10, initial: actual.nivel_tecnologico },
    { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
  ]);

  if (Object.keys(respuestas).length === 0) {
    return;
  }

  try {
    gestor.modificarDimension(id, respuestas);
    await repositorio.guardar();
    console.log(`Sistema: Dimensión ${id} modificada y guardada correctamente.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una especie, muestra sus datos actuales y permite modificarlos
 * @param gestor - El gestor donde se buscará y modificará la especie
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuModificarEspecie(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la especie a MODIFICAR (ej. ESP-001):"
  });

  if (!id) {
    return;
  }

  const actual = gestor.especies.find(esp => esp.id === id);
  
  if (!actual) {
    console.log(`Sistema: No se encontró ninguna especie con el ID ${id}`);
    await pausa();
    return;
  }

  const respuestas = await prompts([
    { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
    { type: "text", name: "id_origen", message: "ID Origen:", initial: actual.id_origen },
    { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
    { type: "number", name: "esperanza_de_vida", message: "Esperanza de vida:", min: 0, initial: actual.esperanza_de_vida },
    { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
  ]);

  if (Object.keys(respuestas).length === 0) {
    return;
  }

  try {
    gestor.modificarEspecie(id, respuestas);
    await repositorio.guardar();
    console.log(`Sistema: Especie ${id} modificada y guardada correctamente.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de una localización, muestra sus datos actuales y permite modificarlos
 * @param gestor - El gestor donde se buscará y modificará la localización
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuModificarLocalizacion(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID de la localización a MODIFICAR (ej. LOC-001):"
  });

  if (!id) {
    return;
  }

  const actual = gestor.localizaciones.find(loc => loc.id === id);
  
  if (!actual) {
    console.log(`Sistema: No se encontró ninguna localización con el ID ${id}`);
    await pausa();
    return;
  }

  const respuestas = await prompts([
    { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
    { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
    { type: "text", name: "id_dimension", message: "ID Dimensión:", initial: actual.id_dimension },
    { type: "number", name: "poblacion", message: "Población:", min: 0, initial: actual.poblacion },
    { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
  ]);

  if (Object.keys(respuestas).length === 0) {
    return;
  }

  try {
    gestor.modificarLocalizacion(id, respuestas);
    await repositorio.guardar();
    console.log(`Sistema: Localización ${id} modificada y guardada correctamente.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}

/**
 * Pide el ID de un artefacto, muestra sus datos actuales y permite modificarlos
 * @param gestor - El gestor donde se buscará y modificará el artefacto
 * @param repositorio - El sistema para guardar los cambios
 */
export async function menuModificarArtefacto(gestor: GestorMultiverso, repositorio: IRepositorio): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID del artefacto a MODIFICAR (ej. ART-001):"
  });

  if (!id) {
    return;
  }

  const actual = gestor.artefactos.find(art => art.id === id);
  
  if (!actual) {
    console.log(`Sistema: No se encontró ningún artefacto con el ID ${id}`);
    await pausa();
    return;
  }

  const respuestas = await prompts([
    { type: "text", name: "nombre", message: "Nombre:", initial: actual.nombre },
    { type: "text", name: "id_inventor", message: "ID Inventor:", initial: actual.id_inventor },
    { type: "text", name: "tipo", message: "Tipo:", initial: actual.tipo },
    { type: "number", name: "nivel_peligrosidad", message: "Peligrosidad (1-10):", min: 1, max: 10, initial: actual.nivel_peligrosidad },
    { type: "text", name: "descripcion", message: "Descripción:", initial: actual.descripcion },
  ]);

  if (Object.keys(respuestas).length === 0) {
    return;
  }

  try {
    gestor.modificarArtefacto(id, respuestas);
    await repositorio.guardar();
    console.log(`Sistema: Artefacto ${id} modificado y guardado correctamente.`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  await pausa();
}