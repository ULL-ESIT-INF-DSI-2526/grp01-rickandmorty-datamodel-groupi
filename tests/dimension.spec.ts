import { describe, expect, test } from "vitest";
import { Dimension } from "../src/dimension";

describe("Clase Dimension", () => {
  const id_valido1 = "C-137";
  const id_valido2 = "J19ζ7";
  const id_valido3 = "C-500A";

  test("Creación de instancia y getters básicos", () => {
    const dim = new Dimension(id_valido1, "Dimensión Cronenberg", "Activa", 8, "Lugar de origen del Rick original");
    
    expect(dim.id).toBe(id_valido1);
    expect(dim.nombre).toBe("Dimensión Cronenberg");
    expect(dim.estado).toBe("Activa");
    expect(dim.nivel_tecnologico).toBe(8);
    expect(dim.descripcion).toBe("Lugar de origen del Rick original");
  })

  test("Debería aceptar diferentes formatos de ID válidos (con/sin guion y letras griegas)", () => {
    const dim_zeta = new Dimension(id_valido2, "Dimensión Doofus", "Activa", 5, "Hogar de Doofus Rick");
    const dim_suffix = new Dimension(id_valido3, "Dimensión C-500A", "En cuarentena", 10, "Alta tecnología");
    
    expect(dim_zeta.id).toBe("J19ζ7");
    expect(dim_suffix.id).toBe("C-500A");
  })

  test("Debería lanzar error si el ID no es válido", () => {
    // No empieza por letra, símbolos raros al inicio, o vacío
    expect(() => new Dimension("137-C", "Error", "Activa", 5, "")).toThrow("ERROR: ID introducido inválido");
    expect(() => new Dimension("-C137", "Error", "Activa", 5, "")).toThrow("ERROR: ID introducido inválido");
    expect(() => new Dimension("", "Error", "Activa", 5, "")).toThrow("ERROR: ID introducido inválido");
  })

  test("Debería lanzar error si el nivel tecnológico está fuera de rango (1-10) en el constructor", () => {
    expect(() => new Dimension("C-137", "Test", "Activa", 0, "Bajo")).toThrow("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
    expect(() => new Dimension("C-137", "Test", "Activa", 11, "Alto")).toThrow("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
  })

  test("Setters: modificación de atributos", () => {
    const dim = new Dimension("C-137", "Nombre inicial", "Activa", 5, "Desc inicial");
    
    dim.nombre = "Dimensión Burbuja de Mantequilla";
    dim.estado = "Destruida";
    dim.descripcion = "Una dimensión bastante pegajosa";
    
    expect(dim.nombre).toBe("Dimensión Burbuja de Mantequilla");
    expect(dim.estado).toBe("Destruida");
    expect(dim.descripcion).toBe("Una dimensión bastante pegajosa");
  })

  test("Setter de nivel_tecnologico: validación de rango", () => {
    const dim = new Dimension("C-137", "Test", "Activa", 5, "Test");
    
    dim.nivel_tecnologico = 10;
    expect(dim.nivel_tecnologico).toBe(10);
    
    // Valores inválidos setter
    expect(() => { dim.nivel_tecnologico = 0; }).toThrow("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
    expect(() => { dim.nivel_tecnologico = 11; }).toThrow("ERROR: Nivel tecnológico fuera del rango permitido (1-10)");
  })
});