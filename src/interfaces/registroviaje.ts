/**
 * Interfaz que define la estructura de un registro de viaje interdimensional
 */
export interface RegistroViaje {
  id_personaje: string;
  id_dimension_origen: string;
  id_dimension_destino: string;
  fecha: Date;
  motivo: string;
}
