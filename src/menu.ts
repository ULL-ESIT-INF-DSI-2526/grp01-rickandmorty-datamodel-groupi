import prompts from "prompts";
import { Low } from "lowdb";
import { GestorMultiverso } from "./gestor.js";
import { Dimension, Estado } from "./dimension.js";
import { Personaje } from "./personaje.js";
import { Especie } from "./especie.js";
import { EntidadesSchema, DimensionData, PersonajeData, EspecieData, LocalizacionData, ArtefactoData, RegistroViajeData} from "./base_de_datos/schema.js";
import { Localizacion } from "./localizacion.js";
import { Artefacto } from "./artefacto.js";


export class MenuInteractivo {
  #gestor: GestorMultiverso;
  #db: Low<EntidadesSchema>;

  constructor(gestor: GestorMultiverso, db: Low<EntidadesSchema>) {
    this.#gestor = gestor;
    this.#db = db;
  }

  async #crearDimension(): Promise<void> {
    const respuestas = await prompts([
      { type: "text", name: "id", message: "ID (Ej: C-137):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      {
        type: "select",
        name: "estado",
        message: "Estado:",
        choices: [
          { title: "Activa", value: "Activa" },
          { title: "Destruida", value: "Destruida" },
          { title: "En cuarentena", value: "En cuarentena" },
        ],
      },
      { type: "number", name: "tech", message: "Nivel Tecnológico (1-10):" },
      { type: "text", name: "desc", message: "Descripción:" },
    ]);

    try {
      const nueva = new Dimension(respuestas.id, respuestas.nombre, respuestas.estado as Estado, respuestas.tech, respuestas.desc);
      this.#gestor.crearDimension(nueva);
      await this.#sincronizar();
      console.log("Sistema: Dimensión guardada.");
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
    await this.#pausa();
  }


  async #crearLocalizacion(): Promise<void> {
    const l = await prompts([
      { type: "text", name: "id", message: "ID (LOC-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "tipo", message: "Tipo:" },
      { type: "text", name: "id_dim", message: "ID Dimensión:" },
      { type: "number", name: "pob", message: "Población:" },
      { type: "text", name: "desc", message: "Descripción:" },
    ]);

    if (Object.keys(l).length === 0) return;

    try {

      const moduloLoc = await import("./localizacion.js");


      const nuevaLoc = new moduloLoc.Localizacion(
        l.id,
        l.nombre,
        l.tipo,
        l.id_dim,
        l.pob,
        l.desc,
      );


      const g = this.#gestor as unknown as {
        localizaciones: Array<typeof nuevaLoc>;
      };
      g.localizaciones.push(nuevaLoc);

      await this.#sincronizar();
      console.log("Sistema: Localización cartografiada.");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    }
    await this.#pausa();
  }

  async #crearArtefacto(): Promise<void> {
    const a = await prompts([
      { type: "text", name: "id", message: "ID (ART-XXX):" },
      { type: "text", name: "nombre", message: "Nombre del invento:" },
      { type: "text", name: "inventor", message: "ID del Inventor:" },
      { type: "text", name: "tipo", message: "Tipo de tecnología:" },
      { type: "number", name: "peligro", message: "Peligrosidad (1-10):" },
      { type: "text", name: "desc", message: "Descripción:" },
    ]);

    if (Object.keys(a).length === 0) return;

    try {
      const { Artefacto } = await import("./artefacto.js");
      const nuevoArt = new Artefacto(
        a.id,
        a.nombre,
        a.inventor,
        a.tipo,
        a.peligro,
        a.desc,
      );

      const g = this.#gestor as unknown as { artefactos: unknown[] };
      g.artefactos.push(nuevoArt);

      await this.#sincronizar();
      console.log("Sistema: Artefacto registrado en el inventario de Rick.");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    }
    await this.#pausa();
  }


  async #buscarVersiones(): Promise<void> {
    const { nombre } = await prompts({
      type: "text",
      name: "nombre",
      message: "Nombre del personaje a buscar (ej. Rick):",
    });

    if (!nombre) return;

    const g = this.#gestor as unknown as { personajes: Personaje[] };
    const coincidencias = g.personajes.filter((p) =>
      p.nombre.toLowerCase().includes(nombre.toLowerCase()),
    );

    console.log(`\n--- VARIANTES DE ${nombre.toUpperCase()} ---`);
    console.table(
      coincidencias.map((p) => ({
        ID: p.id,
        Nombre: p.nombre,
        Dimensión: p.id_dimension,
        Estado: p.estado,
      })),
    );
    await this.#pausa();
  }

  async #crearEspecie(): Promise<void> {
    const e = await prompts([
      { type: "text", name: "id", message: "ID (ESP-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "origen", message: "ID Origen (Dim/Loc):" },
      { type: "text", name: "tipo", message: "Tipo (Humanoide, Alien, etc.):" },
      { type: "number", name: "vida", message: "Esperanza de vida (años):" },
      { type: "text", name: "desc", message: "Descripción:" },
    ]);

    if (Object.keys(e).length === 0) return;

    try {
      const nuevaEspecie = new Especie(
        e.id,
        e.nombre,
        e.origen,
        e.tipo,
        e.vida,
        e.desc,
      );
      const g = this.#gestor as unknown as { especies: Especie[] };
      g.especies.push(nuevaEspecie);

      await this.#sincronizar();
      console.log("Sistema: Especie registrada correctamente.");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    }
    await this.#pausa();
  }


  async #mostrarPeligros(): Promise<void> {
    const peligrosos = this.#gestor.inventosMasPeligrosos();

    console.log("\n--- REPORTE DE SEGURIDAD: ARTEFACTOS PELIGROSOS ---");
    console.table(
      peligrosos.map((item) => ({
        Artefacto: item.artefacto.nombre,
        Nivel_Peligro: item.artefacto.nivel_peligrosidad,
        Ubicación: item.localizacion.nombre,
      })),
    );
    await this.#pausa();
  }

  async #mostrarAnomalias(): Promise<void> {
    const { personajesSinDim } = this.#gestor.detectarAnomalias();
    console.table(
      personajesSinDim.map((p) => ({
        Nombre: p.nombre,
        Ubicacion: p.id_dimension,
      })),
    );
  }


  async #crearPersonaje(): Promise<void> {
    const r = await prompts([
      { type: "text", name: "id", message: "ID (PER-XXX):" },
      { type: "text", name: "nombre", message: "Nombre:" },
      { type: "text", name: "especie", message: "ID Especie (ESP-XXX):" },
      { type: "text", name: "dim", message: "ID Dimensión Origen:" },
      { type: "text", name: "estado", message: "Estado (Vivo, Muerto, etc.):" },
      { type: "text", name: "afiliacion", message: "Afiliación:" },
      {
        type: "number",
        name: "inte",
        message: "Inteligencia (1-10):",
        min: 1,
        max: 10,
      },
      { type: "text", name: "desc", message: "Descripción:" },
    ]);

    if (r.id === undefined) {
      return;
    }

    try {
      const nuevo = new Personaje(
        r.id,
        r.nombre,
        r.especie,
        r.dim,
        r.estado,
        r.afiliacion,
        r.inte,
        r.desc,
      );

      this.#gestor.crearPersonaje(nuevo);
      await this.#sincronizar();
      console.log("Sistema: Personaje registrado correctamente.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
    await this.#pausa();
  }

  async #registrarViaje(): Promise<void> {
    const v = await prompts([
      { type: "text", name: "per", message: "ID del Personaje:" },
      { type: "text", name: "dest", message: "ID Dimensión Destino:" },
      { type: "text", name: "motivo", message: "Motivo del viaje:" },
    ]);

    try {
      this.#gestor.registrarViaje(v.per, v.dest, v.motivo); //
      await this.#sincronizar();
      console.log("Sistema: El viaje ha sido procesado y guardado.");
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message);
    }
  }


  async #sincronizar(): Promise<void> {

    const gestor = this.#gestor;

    this.#db.data = {

      dimensiones: gestor.dimensiones.map(
        (d): DimensionData => ({
          id: d.id,
          nombre: d.nombre,
          estado: d.estado,
          nivel_tecnologico: d.nivel_tecnologico,
          descripcion: d.descripcion,
        }),
      ),

      personajes: gestor.personajes.map(
        (p): PersonajeData => ({
          id: p.id,
          nombre: p.nombre,
          id_especie: p.id_especie,
          id_dimension: p.id_dimension,
          estado: p.estado,
          afiliacion: p.afiliacion,
          nivel_inteligencia: p.nivel_inteligencia,
          descripcion: p.descripcion,
        }),
      ),

      especies: gestor.especies.map(
        (e): EspecieData => ({
          id: e.id,
          nombre: e.nombre,
          id_origen: e.id_origen,
          tipo: e.tipo,
          esperanza_de_vida: e.esperanza_de_vida,
          descripcion: e.descripcion,
        }),
      ),

      localizaciones: gestor.localizaciones.map(
        (l): LocalizacionData => ({
          id: l.id,
          nombre: l.nombre,
          tipo: l.tipo,
          id_dimension: l.id_dimension,
          poblacion: l.poblacion,
          descripcion: l.descripcion,
        }),
      ),

      artefactos: gestor.artefactos.map(
        (a): ArtefactoData => ({
          id: a.id,
          nombre: a.nombre,
          id_inventor: a.id_inventor,
          tipo: a.tipo,
          nivel_peligrosidad: a.nivel_peligrosidad,
          descripcion: a.descripcion,
        }),
      ),

      historialViajes: this.#gestor.todosLosViajes.map((v) => ({
        id_personaje: v.id_personaje,
        id_dimension_origen: v.id_dimension_origen,
        id_dimension_destino: v.id_dimension_destino,
        fecha: v.fecha.toISOString(),
        motivo: v.motivo,
      })),
    };

    await this.#db.write();
  }

  async #pausa(): Promise<void> {
    await prompts({
      type: "text",
      name: "key",
      message: "Presione Enter para continuar...",
    });
  }

  public async iniciar(): Promise<void> {
    let salir = false;
    while (!salir) {
      console.clear();
      const { opcion } = await prompts({
        type: "select",
        name: "opcion",
        message: "=== GESTOR MULTIVERSAL RICK & MORTY ===",
        choices: [
          { title: "Nueva Dimensión", value: "ADD_DIM" },
          { title: "Nuevo Personaje", value: "ADD_PER" },
          { title: "Nueva Especie", value: "ADD_ESP" },
          { title: "Nueva Localización", value: "ADD_LOC" },
          { title: "Nuevo Artefacto", value: "ADD_ART" },
          { title: "Registrar Viaje", value: "VIAJE" },
          { title: "Buscar Variantes", value: "SEARCH_VAR" },
          { title: "Informe: Anomalías", value: "ANOM" },
          { title: "Informe: Peligrosidad", value: "PELIGRO" },
          { title: "Salir", value: "EXIT" },
        ],
      });

      if (opcion === "EXIT") {
        salir = true;
      } else {
        switch (opcion) {
          case "ADD_DIM":
            await this.#crearDimension();
            break;
          case "ADD_PER":
            await this.#crearPersonaje();
            break;
          case "ADD_ESP":
            await this.#crearEspecie();
            break;
          case "ADD_LOC":
            await this.#crearLocalizacion();
            break;
          case "ADD_ART":
            await this.#crearArtefacto();
            break;
          case "VIAJE":
            await this.#registrarViaje();
            break;
          case "SEARCH_VAR":
            await this.#buscarVersiones();
            break;
          case "ANOM":
            await this.#mostrarAnomalias();
            break;
          case "PELIGRO":
            await this.#mostrarPeligros();
            break;
        }
      }
    }
  }
}
