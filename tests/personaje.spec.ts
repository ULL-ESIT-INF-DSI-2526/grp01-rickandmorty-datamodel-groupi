import { describe, expect, test } from "vitest";
import { Personaje } from "../src/personaje";

describe("Clase Personaje", () => {
  const id_valido = "PER-001";
  const nombre_valido = "Rick Sanchez";
  const esp_referencia = "ESP-001";
  const dim_referencia = "C-137";
  const inteligencia_valida = 10;

  test("Creación de instancia y getters básicos", () => {
    const personaje = new Personaje(
      id_valido,
      nombre_valido,
      esp_referencia,
      dim_referencia,
      "Vivo",
      "Consejo de Ricks",
      inteligencia_valida,
      "El hombre más inteligente del universo."
    );

    expect(personaje.id).toBe("PER-001");
    expect(personaje.nombre).toBe("Rick Sanchez");
    expect(personaje.id_especie).toBe("ESP-001");
    expect(personaje.id_dimension).toBe("C-137");
    expect(personaje.estado).toBe("Vivo");
    expect(personaje.nivel_inteligencia).toBe(10);
  })

  test("Debería lanzar error si el ID de personaje no comienza por PER-", () => {
    expect(() => {
      new Personaje("RICK-001", "Rick", esp_referencia, dim_referencia, "Vivo", "Independiente", 10, "");
    }).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si la referencia de especie es inválida", () => {
    expect(() => {
      new Personaje(id_valido, nombre_valido, "HUMANO", dim_referencia, "Vivo", "Independiente", 10, "");
    }).toThrow("ERROR: ID de la especie introducido inválido");
  })

  test("Debería lanzar error si la referencia de dimensión es inválida", () => {
    expect(() => {
      new Personaje(id_valido, nombre_valido, esp_referencia, "DIM-C137", "Vivo", "Independiente", 10, "");
    }).toThrow("ERROR: ID de la dimensión introducido inválido");
  })

  test("Debería lanzar error si la inteligencia está fuera de rango (1-10) en constructor", () => {
    expect(() => {
      new Personaje(id_valido, nombre_valido, esp_referencia, dim_referencia, "Vivo", "Independiente", 11, "");
    }).toThrow("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
  })

  test("Setters: modificación de estado, afiliación y nombre", () => {
    const p = new Personaje(id_valido, "Morty Smith", esp_referencia, dim_referencia, "Vivo", "Familia Smith", 3, "Nieto de Rick");
    
    p.nombre = "Evil Morty";
    p.estado = "Desconocido";
    p.afiliacion = "Independiente";
    p.descripcion = "Lleva un parche en el ojo";

    expect(p.nombre).toBe("Evil Morty");
    expect(p.estado).toBe("Desconocido");
    expect(p.afiliacion).toBe("Independiente");
    expect(p.descripcion).toBe("Lleva un parche en el ojo");
  })

  test("Setter id_especie: Cambio de especie", () => {
    const rick = new Personaje(id_valido, "Rick Sanchez", "ESP-001", dim_referencia, "Vivo", "Independiente", 10, "");
    
    rick.id_especie = "ESP-002";
    expect(rick.id_especie).toBe("ESP-002");

    expect(() => { rick.id_especie = "PEPINILLO"; }).toThrow("ERROR: ID de la especie introducido inválido");
  })

  test("Setter nivel_inteligencia: validación de rango", () => {
    const morty = new Personaje("PER-002", "Morty", esp_referencia, dim_referencia, "Vivo", "Familia Smith", 3, "");
    
    morty.nivel_inteligencia = 9;
    expect(morty.nivel_inteligencia).toBe(9);

    expect(() => { morty.nivel_inteligencia = 15; }).toThrow("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
    expect(() => { morty.nivel_inteligencia = 0; }).toThrow("ERROR: Nivel de inteligencia fuera del rango permitido (1-10)");
  })
});