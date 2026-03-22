import prompts from "prompts";
import { GestorMultiverso } from "../gestor.js";
import { pausa } from "./utilidades.js";

/**
 * Muestra una lista de los artefactos ordenados por su nivel de peligrosidad
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuMostrarPeligros(gestor: GestorMultiverso): Promise<void> {
  const peligrosos = gestor.inventosMasPeligrosos();

  console.log("\n--- REPORTE DE SEGURIDAD: ARTEFACTOS PELIGROSOS ---");
  console.table(
    peligrosos.map((item) => ({
      Artefacto: item.artefacto.nombre,
      Nivel_Peligro: item.artefacto.nivel_peligrosidad,
      Ubicación: item.localizacion.nombre,
    })),
  );

  await pausa();
}

/**
 * Muestra una lista de personajes cuya dimensión de origen no existe o está destruida
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuMostrarAnomalias(gestor: GestorMultiverso): Promise<void> {
  const { personajesSinDim } = gestor.detectarAnomalias();
  console.table(
    personajesSinDim.map((p) => ({
      Nombre: p.nombre,
      Ubicacion: p.id_dimension,
    })),
  );
  await pausa();
}

/**
 * Genera y muestra un informe con todas las dimensiones activas, 
 * calculando el nivel tecnológico medio del multiverso activo
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuInformeDimensionesActivas(gestor: GestorMultiverso): Promise<void> {
  const activas = gestor.listadoDimActivas();
  
  console.log(`\n--- INFORME: DIMENSIONES ACTIVAS (${activas.length}) ---`);
  if (activas.length > 0) {
    console.table(activas.map(dim => ({ ID: dim.id, Nombre: dim.nombre, Tecnología: dim.nivel_tecnologico })));
    
    // Media
    const suma = activas.reduce((acc, dim) => acc + dim.nivel_tecnologico, 0);
    const media = (suma / activas.length).toFixed(2);
    console.log(`\n>> NIVEL TECNOLÓGICO MEDIO DEL MULTIVERSO ACTIVO: ${media}/10 <<\n`);
  } else {
    console.log("No hay dimensiones activas en este momento");
  }
  await pausa();
}

/**
 * Genera y muestra un informe detallando los personajes que cuentan 
 * con el mayor número de versiones alternativas registradas en el sistema
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuInformeMayorVersion(gestor: GestorMultiverso): Promise<void> {
  const resultados = gestor.mayorVersionAlternativa();
  
  console.log(`\n--- INFORME: PERSONAJES CON MÁS VERSIONES ALTERNATIVAS ---`);
  if (resultados.length > 0) {
    console.table(resultados);
  } else {
    console.log("No hay suficientes datos registrados");
  }
  await pausa();
}

/**
 * Pide el ID de un personaje y muestra una tabla detallada 
 * con el historial completo de sus viajes interdimensionales
 * @param gestor - El gestor del multiverso para consultar los datos
 */
export async function menuInformeHistorialViajes(gestor: GestorMultiverso): Promise<void> {
  const { id } = await prompts({
    type: "text",
    name: "id",
    message: "Introduce el ID del personaje para ver su historial de viajes:"
  });

  if (!id) {
    return;
  }

  const personaje = gestor.personajes.find(per => per.id === id);
  if (!personaje) {
    console.log("Sistema: Personaje no encontrado");
    await pausa();
    return;
  }

  const viajes = gestor.historialViajes(personaje);
  
  console.log(`\n--- HISTORIAL DE VIAJES: ${personaje.nombre.toUpperCase()} ---`);
  if (viajes.length > 0) {
    console.table(viajes.map(viaj => ({
      Fecha: viaj.fecha.toLocaleDateString(),
      Origen: viaj.id_dimension_origen,
      Destino: viaj.id_dimension_destino,
      Motivo: viaj.motivo
    })));
  } else {
    console.log("Este personaje no ha realizado ningún viaje interdimensional");
  }
  await pausa();
}