import prompts from "prompts";

/**
 * Detiene la pantalla mostrando un prompt para que el usuario
 * presione Enter antes de limpiar la pantalla y volver al menú principal
 */
export async function pausa(): Promise<void> {
  await prompts({
    type: "text",
    name: "key",
    message: "Presione Enter para continuar...",
  });
}