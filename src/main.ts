import { JSONFilePreset } from 'lowdb/node';
import { MenuInteractivo } from './menu/menu.js';
import { GestorMultiverso } from './gestor.js';
import { RepositorioMultiverso } from './base_de_datos/repositorio.js';
import { Dimension } from './entidades/dimension.js';
import { Personaje } from './entidades/personaje.js';
import { Especie } from './entidades/especie.js';
import { Localizacion } from './entidades/localizacion.js';
import { Artefacto } from './entidades/artefacto.js';
import { EntidadesSchema } from './base_de_datos/schema.js';

/**
 * Función principal que arranca la aplicación
 * Carga la base de datos, prepara los datos y lanza el menú
 */
async function iniciarMultiverso() {
  console.log("Iniciando conexión con el Multiverso...");

  const db = await JSONFilePreset<EntidadesSchema>('./src/base_de_datos/database.json', {
    dimensiones: [],
    personajes: [],
    especies: [],
    localizaciones: [],
    artefactos: [],
    historialViajes: []
  });
 
  const dimensiones = db.data.dimensiones.map(dim => 
    new Dimension(dim.id, dim.nombre, dim.estado, dim.nivel_tecnologico, dim.descripcion)
  );

  const especies = db.data.especies.map(esp => 
    new Especie(esp.id, esp.nombre, esp.id_origen, esp.tipo, esp.esperanza_de_vida, esp.descripcion)
  );

  const personajes = db.data.personajes.map(per => 
    new Personaje(per.id, per.nombre, per.id_especie, per.id_dimension, per.estado, per.afiliacion, per.nivel_inteligencia, per.descripcion)
  );

  const localizaciones = db.data.localizaciones.map(loc => 
    new Localizacion(loc.id, loc.nombre, loc.tipo, loc.id_dimension, loc.poblacion, loc.descripcion)
  );

  const artefactos = db.data.artefactos.map(art => 
    new Artefacto(art.id, art.nombre, art.id_inventor, art.tipo, art.nivel_peligrosidad, art.descripcion)
  );
  const historial = db.data.historialViajes.map(viaje => ({
    ...viaje,
    fecha: new Date(viaje.fecha) // Convertimos el string ISO a objeto Date
  }));

  // Prepara el gestor, el guardado y el menú con los datos recuperados
  const gestor = new GestorMultiverso(
    dimensiones,
    personajes,
    especies,
    localizaciones,
    artefactos,
    historial
  );

  const repositorio = new RepositorioMultiverso(gestor, db);

  const menu = new MenuInteractivo(gestor, repositorio);

  await menu.iniciar();
}

// Ejecución de la función principal con control de errores
iniciarMultiverso().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error("ERROR FATAL AL CARGAR EL MULTIVERSO:", error.message);
  }
  process.exit(1);
});