import { Dimension, Estado } from "../entidades/dimension.js";
import { Personaje } from "../entidades/personaje.js";
import { Especie } from "../entidades/especie.js";
import { Localizacion } from "../entidades/localizacion.js";
import { Artefacto } from "../entidades/artefacto.js";
import { RegistroViaje } from "./registroviaje.js";

/**
 * Métodos para crear entidades en el multiverso
 */
export interface ICreador {
  crearPersonaje(nuevoPersonaje: Personaje): void;
  crearEspecie(nuevaEspecie: Especie): void;
  crearLocalizacion(nuevaLocalizacion: Localizacion): void;
  crearArtefacto(nuevoArtefacto: Artefacto): void;
  crearDimension(nuevaDimension: Dimension): void;
}

/**
 * Métodos para eliminar entidades en el multiverso
 */
export interface IEliminador {
  eliminarPersonaje(id_personaje: string): void;
  eliminarDimension(id_dimension: string): void;
  eliminarEspecie(id_especie: string): void;
  eliminarLocalizacion(id_localizacion: string): void;
  eliminarArtefacto(id_artefacto: string): void;
}

/**
 * Métodos para modificar los datos de las entidades
 */
export interface IModificador {
  modificarPersonaje(id_personaje: string, nuevosDatos: { nombre?: string, id_especie?: string, id_dimension?: string, estado?: string, afiliacion?: string, nivel_inteligencia?: number, descripcion?: string }): void;
  modificarDimension(id_dimension: string, nuevosDatos: { nombre?: string, estado?: Estado, nivel_tecnologico?: number, descripcion?: string }): void;
  modificarEspecie(id_especie: string, nuevosDatos: { nombre?: string, id_origen?: string, tipo?: string, esperanza_de_vida?: number, descripcion?: string }): void;
  modificarLocalizacion(id_localizacion: string, nuevosDatos: { nombre?: string, tipo?: string, id_dimension?: string, poblacion?: number, descripcion?: string }): void;
  modificarArtefacto(id_artefacto: string, nuevosDatos: { nombre?: string, id_inventor?: string, tipo?: string, nivel_peligrosidad?: number, descripcion?: string }): void;
}

/**
 * Métodos para consultar datos y generar informes
 */
export interface IConsultor {
  detectarAnomalias(): {dimensionesDestruidas: Dimension[], personajesSinDim: Personaje[]};
  listadoDimActivas(): Dimension[];
  mayorVersionAlternativa(): { nombre: string, cantidad: number }[];
  inventosMasPeligrosos(): { artefacto: Artefacto, localizacion: Localizacion }[];
  historialViajes(personaje: Personaje): RegistroViaje[];
}

/**
 * Métodos para gestionar eventos
 */
export interface IGestorEventos {
  registrarViaje(id_personaje: string, id_dimension_destino: string, motivo: string): RegistroViaje;
  destruirDimension(id_dimension: string): void;
  despliegueArtefacto(id_artefacto: string, id_localizacion: string): void;
  neutralizarArtefacto(id_artefacto: string, id_localizacion: string): void;
}

/**
 * Interfaz que define la acción de guardar la información del multiverso
 */
export interface IRepositorio {
  guardar(): Promise<void>;
}