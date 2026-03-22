import { describe, expect, test, vi } from "vitest";
import { pausa } from "../../src/menu/utilidades.js";
import prompts from "prompts";

// Mock para que el test no se quede parado esperando a que se pulse el teclado
vi.mock("prompts", () => {
  return {
    default: vi.fn().mockResolvedValue({ key: "" })
  };
});

describe("Pruebas de utilidades", () => {
  
  test("pausa: comprueba que llama al prompt de enter", async () => {
    // Llamamos a la funcion
    await pausa();

    // Miramos si se ha llamado a la libreria una vez
    expect(prompts).toHaveBeenCalledTimes(1);

    // Miramos que el mensaje sea el que pusimos en el codigo
    expect(prompts).toHaveBeenCalledWith({
      type: "text",
      name: "key",
      message: "Presione Enter para continuar...",
    });
  })

});