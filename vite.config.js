import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        sobre_nosotros: 'sobre-nosotros.html',
        alquiler: 'alquiler.html',
        venta: 'venta.html',
        ocasion: 'ocasion.html',
        contacto: 'contacto.html',
        premios: 'premios.html',
        club: 'club.html'
      }
    }
  }
});
