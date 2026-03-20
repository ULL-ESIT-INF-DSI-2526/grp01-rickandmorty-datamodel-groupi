import { JSONFilePreset } from 'lowdb/node';
import { MenuInteractivo } from './menu.js';
import { GestorMultiverso } from './gestor.js';
import { Dimension } from './dimension.js';
import { Personaje } from './personaje.js';
import { Especie } from './especie.js';
import { Localizacion } from './localizacion.js';
import { Artefacto } from './artefacto.js';
import { EntidadesSchema } from './base_de_datos/schema.js';


async function bootstrap() {
  console.log("Iniciando conexión con el Multiverso...");


const db = await JSONFilePreset<EntidadesSchema>('./src/base_de_datos/database.json', {
  dimensiones: [],
  personajes: [],
  especies: [],
  localizaciones: [],
  artefactos: [],
  historialViajes: []
});
 
  const dimensiones = db.data.dimensiones.map(d => 
    new Dimension(d.id, d.nombre, d.estado, d.nivel_tecnologico, d.descripcion)
  );

  const especies = db.data.especies.map(e => 
    new Especie(e.id, e.nombre, e.id_origen, e.tipo, e.esperanza_de_vida, e.descripcion)
  );

  const personajes = db.data.personajes.map(p => 
    new Personaje(p.id, p.nombre, p.id_especie, p.id_dimension, p.estado, p.afiliacion, p.nivel_inteligencia, p.descripcion)
  );

  const localizaciones = db.data.localizaciones.map(l => 
    new Localizacion(l.id, l.nombre, l.tipo, l.id_dimension, l.poblacion, l.descripcion)
  );

  const artefactos = db.data.artefactos.map(a => 
    new Artefacto(a.id, a.nombre, a.id_inventor, a.tipo, a.nivel_peligrosidad, a.descripcion)
  );
  const historial = db.data.historialViajes.map(viaje => ({
    ...viaje,
    fecha: new Date(viaje.fecha) // Convertimos el string ISO a objeto Date
  }))

  const gestor = new GestorMultiverso(
    dimensiones,
    personajes,
    especies,
    localizaciones,
    artefactos,
    historial
  );

  const menu = new MenuInteractivo(gestor, db);

  await menu.iniciar();
}

bootstrap().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error("ERROR FATAL AL CARGAR EL MULTIVERSO:", err.message);
  }
  process.exit(1);
});