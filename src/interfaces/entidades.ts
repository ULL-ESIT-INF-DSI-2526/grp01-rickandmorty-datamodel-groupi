import { Estado } from "../entidades/dimension.js";

/**
 * Propiedades de la entidad Dimensión
 */
export interface IDimension {
  readonly id: string;
  nombre: string;
  estado: Estado;
  nivel_tecnologico: number;
  descripcion: string;
}

/**
 * Propiedades de la entidad Personaje
 */
export interface IPersonaje {
  readonly id: string;
  nombre: string;
  id_especie: string;
  id_dimension: string;
  estado: string;
  afiliacion: string;
  nivel_inteligencia: number;
  descripcion: string;
}

/**
 * Propiedades de la entidad Especie
 */
export interface IEspecie {
  readonly id: string;
  nombre: string;
  id_origen: string;
  tipo: string;
  esperanza_de_vida: number;
  descripcion: string;
}

/**
 * Propiedades de la entidad Localización
 */
export interface ILocalizacion {
  readonly id: string;
  nombre: string;
  tipo: string;
  id_dimension: string;
  poblacion: number;
  descripcion: string;
}

/**
 * Propiedades de la entidad Artefacto
 */
export interface IArtefacto {
  readonly id: string;
  nombre: string;
  id_inventor: string;
  tipo: string;
  nivel_peligrosidad: number;
  descripcion: string;
}