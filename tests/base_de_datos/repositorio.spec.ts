import { describe, expect, test, vi } from "vitest";
import { RepositorioMultiverso } from "../../src/base_de_datos/repositorio.js";
import { GestorMultiverso } from "../../src/gestor.js";
import { Dimension } from "../../src/entidades/dimension.js";
import { Personaje } from "../../src/entidades/personaje.js";
import { Especie } from "../../src/entidades/especie.js";
import { Localizacion } from "../../src/entidades/localizacion.js";
import { Artefacto } from "../../src/entidades/artefacto.js";
import { RegistroViaje } from "../../src/interfaces/registroviaje.js";
import { EntidadesSchema } from "../../src/base_de_datos/schema.js";
import { Low } from "lowdb";

describe("Clase RepositorioMultiverso", () => {
  
  test("El método guardar() extrae los datos del gestor, los mapea y ejecuta write()", async () => {
    const dim = new Dimension("C-137", "Original", "Activa", 10, "Test");
    const esp = new Especie("ESP-001", "Humano", "C-137", "Humanoide", 80, "Test");
    const per = new Personaje("PER-001", "Rick Sanchez", "ESP-001", "C-137", "Vivo", "Ninguna", 10, "Test");
    const loc = new Localizacion("LOC-001", "Citadela", "Estación", "C-137", 100, "Test");
    const art = new Artefacto("ART-001", "Pistola", "PER-001", "Arma", 10, "Test");
    
    const fecha = new Date("2026-03-22T05:42:00.000Z");
    const viaje: RegistroViaje = {
      id_personaje: "PER-001",
      id_dimension_origen: "C-137",
      id_dimension_destino: "C-131",
      fecha: fecha,
      motivo: "Testeo unitario"
    };

    const gestor = new GestorMultiverso([dim], [per], [esp], [loc], [art], [viaje]);

    const SchemaFalso: EntidadesSchema = {
      dimensiones: [], 
      personajes: [], 
      especies: [], 
      localizaciones: [], 
      artefactos: [], 
      historialViajes: []
    };

    // Creamos una base de datos falsa
    const dbMock = {
      data: SchemaFalso,
      write: vi.fn().mockResolvedValue(undefined)
    } as unknown as Low<EntidadesSchema>;

    const repositorio = new RepositorioMultiverso(gestor, dbMock);
    await repositorio.guardar();

    // COMPROBACIONES (que guarde todo y formatee bien la fecha)
    expect(dbMock.write).toHaveBeenCalledTimes(1);

    expect(dbMock.data?.dimensiones.length).toBe(1);
    expect(dbMock.data?.personajes.length).toBe(1);
    expect(dbMock.data?.especies.length).toBe(1);
    expect(dbMock.data?.localizaciones.length).toBe(1);
    expect(dbMock.data?.artefactos.length).toBe(1);
    expect(dbMock.data?.historialViajes.length).toBe(1);

    expect(dbMock.data?.historialViajes[0].fecha).toBe("2026-03-22T05:42:00.000Z");
    
    expect(dbMock.data?.personajes[0].nombre).toBe("Rick Sanchez");
  })

});