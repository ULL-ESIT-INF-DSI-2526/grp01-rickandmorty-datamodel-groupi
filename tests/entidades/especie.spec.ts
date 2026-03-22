import { describe, expect, test } from "vitest";
import { Especie } from "../../src/entidades/especie.js";

describe("Clase Especie", () => {
  const id = "ESP-001"; 
  const nombre = "Humano";
  const origen_dim = "C-137";
  const origen_loc = "LOC-GAZORPAZORP";
  const tipo = "Humanoide";
  const esperanza = 80;
  const descripcion = "Especie inteligente con gran capacidad de adaptación";

  test("Creación de instancia y getters con origen de tipo Dimensión", () => {
    const especie = new Especie(id, nombre, origen_dim, tipo, esperanza, descripcion);
    
    expect(especie.id).toBe("ESP-001");
    expect(especie.nombre).toBe("Humano");
    expect(especie.id_origen).toBe("C-137");
    expect(especie.tipo).toBe("Humanoide");
    expect(especie.esperanza_de_vida).toBe(80);
    expect(especie.descripcion).toBe(descripcion);
  })

  test("Creación de instancia con origen de tipo Localización", () => {
    const especie = new Especie("ESP-002", "Gazorpiano", origen_loc, "Humanoide", 150, "Desc");
    expect(especie.id).toBe("ESP-002");
    expect(especie.id_origen).toBe("LOC-GAZORPAZORP");
  })

  test("Debería lanzar error si el ID de especie no comienza por ESP-", () => {
    expect(() => {
      new Especie("001-ESP", "Humano", origen_dim, tipo, 80, "Desc");
    }).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si el ID de origen no es ni Localización ni Dimensión", () => {
    expect(() => {
      new Especie(id, nombre, "ORIGEN-DESCONOCIDO", tipo, 80, "Desc");
    }).toThrow("ERROR: ID origen introducido inválido");
  })

  test("Debería lanzar error con esperanza de vida negativa en el constructor", () => {
    expect(() => {
      new Especie(id, nombre, origen_dim, tipo, -10, "Desc");
    }).toThrow("ERROR: La esperanza de vida no puede ser negativa");
  })

  test("Setters: modificación de atributos de texto (nombre, tipo, descripcion)", () => {
    const especie = new Especie(id, "Original", origen_dim, "Tipo A", 50, "Desc A");
    
    especie.nombre = "Cronenberg";
    especie.tipo = "Amorfo";
    especie.descripcion = "Resultado de un suero fallido";
    
    expect(especie.nombre).toBe("Cronenberg");
    expect(especie.tipo).toBe("Amorfo");
    expect(especie.descripcion).toBe("Resultado de un suero fallido");
  })

  test("Setter esperanza_de_vida: actualización y validación", () => {
    const especie = new Especie("ESP-005", "Meeseeks", origen_dim, "Especial", 0.001, "Test");
    
    especie.esperanza_de_vida = 100;
    expect(especie.esperanza_de_vida).toBe(100);
    
    expect(() => { especie.esperanza_de_vida = -5; }).toThrow("ERROR: La esperanza de vida no puede ser negativa");
  })

  test("Otros ejemplos", () => {
    const zigerion = new Especie("ESP-003", "Zigerion", "C-137", "Humanoide", 60, "Estafadores");
    const roboto = new Especie("ESP-004", "Robot", "LOC-CIUDADELA", "Robótico", 1000, "Mecánico");
    
    expect(zigerion.id).toBe("ESP-003");
    expect(zigerion.nombre).toBe("Zigerion");
    expect(roboto.id).toBe("ESP-004");
    expect(roboto.tipo).toBe("Robótico");
  })

  test("Setter id_origen: modificación del origen de la especie", () => {
    const especie = new Especie(id, "Pájaros Persona", origen_dim, "Humanoide/Ave", 120, "Son buena gente");
  
    especie.id_origen = "C-500A";
    expect(especie.id_origen).toBe("C-500A");

    especie.id_origen = "LOC-005";
    expect(especie.id_origen).toBe("LOC-005");
  })

});