import { describe, expect, test } from "vitest";
import { Artefacto } from "../../src/entidades/artefacto.js";

describe("Clase Artefacto", () => {
  const id_valido = "ART-001";
  const nombre_valido = "Portal Gun";
  const inventor_referencia = "PER-001";
  const tipo_valido = "Dispositivo de viaje";
  const peligrosidad_valida = 9;
  const descripcion_valida = "Permite viajar entre dimensiones mediante portales verdes";

  test("Creación de instancia y getters básicos", () => {
    const art = new Artefacto(
      id_valido,
      nombre_valido,
      inventor_referencia,
      tipo_valido,
      peligrosidad_valida,
      descripcion_valida
    );

    expect(art.id).toBe("ART-001");
    expect(art.nombre).toBe("Portal Gun");
    expect(art.id_inventor).toBe("PER-001");
    expect(art.tipo).toBe("Dispositivo de viaje");
    expect(art.nivel_peligrosidad).toBe(9);
    expect(art.descripcion).toContain("portales verdes");
  })

  test("Debería lanzar error si el ID del artefacto no comienza por ART-", () => {
    expect(() => {
      new Artefacto("GUN-001", "Portal Gun", inventor_referencia, tipo_valido, 5, "");
    }).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si la referencia del inventor no comienza por PER-", () => {
    expect(() => {
      new Artefacto(id_valido, "Portal Gun", "RICK-C137", tipo_valido, 5, "");
    }).toThrow("ERROR: ID del inventor introducido inválido");
  })

  test("Debería lanzar error si el nivel de peligrosidad está fuera de rango (1-10) en constructor", () => {
    expect(() => {
      new Artefacto(id_valido, "Bomba", inventor_referencia, "Arma", 11, "");
    }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    
    expect(() => {
      new Artefacto(id_valido, "Cuchara", inventor_referencia, "Objeto", 0, "");
    }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
  })

  test("Setters: modificación de nombre, tipo y descripción", () => {
    const art = new Artefacto(id_valido, "Original", inventor_referencia, "Tipo A", 1, "Desc A");
    
    art.nombre = "Cronómetro de Neutrinos";
    art.tipo = "Dispositivo de viaje";
    art.descripcion = "Mide el tiempo en partículas subatómicas";
    
    expect(art.nombre).toBe("Cronómetro de Neutrinos");
    expect(art.tipo).toBe("Dispositivo de viaje");
    expect(art.descripcion).toBe("Mide el tiempo en partículas subatómicas");
  })

  test("Setter nivel_peligrosidad: validación de rango", () => {
    const art = new Artefacto(id_valido, "Megasiembra", inventor_referencia, "Biotecnología", 4, "Semillas raras");
    
    art.nivel_peligrosidad = 8;
    expect(art.nivel_peligrosidad).toBe(8);

    expect(() => { art.nivel_peligrosidad = 15; }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
    expect(() => { art.nivel_peligrosidad = -1; }).toThrow("ERROR: Nivel de peligrosidad fuera del rango permitido (1-10)");
  })

  test("Prueba con otros ejemplos", () => {
    const plumbus = new Artefacto(
      "ART-002", 
      "Brazo de Plumbus", 
      "PER-999", 
      "Objeto cotidiano absurdo", 
      1, 
      "Nadie sabe realmente para qué sirve."
    );
    
    expect(plumbus.id).toBe("ART-002");
    expect(plumbus.tipo).toBe("Objeto cotidiano absurdo");
  })

  test("Setter id_inventor: modificación del inventor del artefacto", () => {
    const art = new Artefacto(id_valido, "Casco de Snuffles", "PER-001", "Biotecnología", 6, "Hace a los perros listos");
    art.id_inventor = "PER-004";
    expect(art.id_inventor).toBe("PER-004");
  })

});