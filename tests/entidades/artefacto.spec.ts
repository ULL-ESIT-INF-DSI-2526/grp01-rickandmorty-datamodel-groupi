import { describe, expect, test } from "vitest";
import { Artefacto } from "../../src/entidades/artefacto.js";

describe("Clase Artefacto", () => {
  const id = "ART-001";
  const nombre = "Portal Gun";
  const inventor = "PER-001";
  const tipo = "Dispositivo de viaje";
  const peligrosidad = 9;
  const descripcion = "Permite viajar entre dimensiones mediante portales verdes";

  test("Creación de instancia y getters básicos", () => {
    const art = new Artefacto(id, nombre, inventor, tipo, peligrosidad, descripcion);

    expect(art.id).toBe("ART-001");
    expect(art.nombre).toBe("Portal Gun");
    expect(art.id_inventor).toBe("PER-001");
    expect(art.tipo).toBe("Dispositivo de viaje");
    expect(art.nivel_peligrosidad).toBe(9);
    expect(art.descripcion).toContain("portales verdes");
  })

  test("Debería lanzar error si el ID del artefacto no comienza por ART-", () => {
    expect(() => {
      new Artefacto("GUN-001", "Portal Gun", inventor, tipo, 5, "");
    }).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si la referencia del inventor no comienza por PER-", () => {
    expect(() => {
      new Artefacto(id, "Portal Gun", "RICK-C137", tipo, 5, "");
    }).toThrow("ERROR: ID del inventor introducido inválido");
  })

  test("Debería lanzar error si el nivel de peligrosidad está fuera de rango (1-10) en constructor", () => {
    expect(() => {
      new Artefacto(id, "Bomba", inventor, "Arma", 11, "");
    }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    
    expect(() => {
      new Artefacto(id, "Cuchara", inventor, "Objeto", 0, "");
    }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
  })

  test("Setters: modificación de nombre, tipo y descripción", () => {
    const art = new Artefacto(id, "Original", inventor, "Tipo A", 1, "Desc A");
    
    art.nombre = "Cronómetro de Neutrinos";
    art.tipo = "Dispositivo de viaje";
    art.descripcion = "Mide el tiempo en partículas subatómicas";
    
    expect(art.nombre).toBe("Cronómetro de Neutrinos");
    expect(art.tipo).toBe("Dispositivo de viaje");
    expect(art.descripcion).toBe("Mide el tiempo en partículas subatómicas");
  })

  test("Setter nivel_peligrosidad: validar rango", () => {
    const art = new Artefacto(id, "Megasiembra", inventor, "Biotecnología", 4, "Semillas raras");
    
    art.nivel_peligrosidad = 8;
    expect(art.nivel_peligrosidad).toBe(8);

    expect(() => { art.nivel_peligrosidad = 15; }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    expect(() => { art.nivel_peligrosidad = -1; }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
  })

  test("Prueba con otros ejemplos", () => {
    const plumbus = new Artefacto("ART-002", "Brazo de Plumbus", "PER-999", "Objeto cotidiano absurdo", 1, "Nadie sabe realmente para qué sirve.");
    
    expect(plumbus.id).toBe("ART-002");
    expect(plumbus.tipo).toBe("Objeto cotidiano absurdo");
  })

  test("Setter id_inventor: modificación del inventor del artefacto", () => {
    const art = new Artefacto(id, "Casco de Snuffles", "PER-001", "Biotecnología", 6, "Hace a los perros listos");
    art.id_inventor = "PER-004";
    expect(art.id_inventor).toBe("PER-004");
  })

});