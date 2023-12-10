# Generador de Código desde Imágenes con Next.js y OpenAI GPT-4 Vision
Este proyecto utiliza Next.js para construir una aplicación web que genera código fuente a partir de imágenes utilizando la API de OpenAI con el nuevo modelo GPT-4 Vision. Está inspirado en el proyecto de código abierto ["screenshot-to-code"](https://github.com/abi/screenshot-to-code).

![image-to-code-hero-02-mockup](https://github.com/leox182/image-to-code/assets/64720826/4433e70b-ab47-4d15-9666-df922c50db87)

## Características
Generación de Código desde Imágenes en local o desde una URL: Utiliza el poder del modelo GPT-4 Vision de OpenAI para transformar imágenes de código en texto funcional.

Interfaz de Usuario Intuitiva: Desarrollado con Next.js, la aplicación proporciona una interfaz de usuario fácil de usar para cargar imágenes y obtener resultados de código.

## Instalación
1. Clona el repositorio:
```
git clone https://github.com/leox182/image-to-code.git
cd image-to-code
```

2. Instala las dependencias:

```
npm install or pnpm install
```

3. Configura las variables de entorno:
Crea un archivo .env.local en la raíz del proyecto y agrega tu clave de API de OpenAI:


```
OPENAI_API_KEY=[AQUI_TU_API_KEY]
```

## Uso
1. Inicia la aplicación:
```
npm run dev or pnpm run dev
```
2. Accede a la aplicación en tu navegador: http://localhost:3000
3. Sube una imagen que contenga elementos de UI o pega una URL y espera a que la magia suceda.

## Recomendaciones
1. La generación de codigo funciona mejor usando la combinación de HTML vanilla + Tailwindcss (por defecto)
2. Funciona mejor generando componentes especificos, por ejemplo un boton y sus variantes

## Contribuciones
¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes una mejora, por favor crea un problema o envía una solicitud de extracción.

## Agradecimientos
Este proyecto se basa en el trabajo del proyecto de código abierto ["screenshot-to-code"](https://github.com/abi/screenshot-to-code). Agradecemos a la comunidad por sus contribuciones.

## Licencia
Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE.md para obtener más detalles.
