import { Estado } from '../dimension';

/**
 * Interfaz para los datos planos de una Dimensión en el JSON
 */
export interface DimensionData {
  id: string;
  nombre: string;
  estado: Estado;
  nivel_tecnologico: number;
  descripcion: string;
}

/**
 * Interfaz para los datos planos de un Personaje
 */
export interface PersonajeData {
  id: string;
  nombre: string;
  id_especie: string;
  id_dimension: string;
  estado: string;
  afiliacion: string;
  nivel_inteligencia: number;
  descripcion: string;
}

/**
 * Interfaz para los datos planos de una Especie
 */
export interface EspecieData {
  id: string;
  nombre: string;
  id_origen: string;
  tipo: string;
  esperanza_de_vida: number;
  descripcion: string;
}

/**
 * Interfaz para los datos planos de una Localización
 */
export interface LocalizacionData {
  id: string;
  nombre: string;
  tipo: string;
  id_dimension: string;
  poblacion: number;
  descripcion: string;
}

/**
 * Interfaz para los datos planos de un Artefacto
 */
export interface ArtefactoData {
  id: string;
  nombre: string;
  id_inventor: string;
  tipo: string;
  nivel_peligrosidad: number;
  descripcion: string;
}

/**
 * Interfaz para el registro de eventos de viaje
 */
export interface RegistroViajeData {
  id_personaje: string;
  id_dimension_origen: string;
  id_dimension_destino: string;
  fecha: string; // Se guarda como string ISO en el JSON
  motivo: string;
}

/**
 * Esquema global que define la estructura completa de la base de datos Lowdb
 */
export interface EntidadesSchema {
  dimensiones: DimensionData[];
  personajes: PersonajeData[];
  especies: EspecieData[];
  localizaciones: LocalizacionData[];
  artefactos: ArtefactoData[];
  historialViajes: RegistroViajeData[];
}