import scrapePeajes from './peajes.js';

(async () => {
    try {
      console.log('Iniciando scraping de peajes...');
      const data = await scrapePeajes();
      console.log('Datos obtenidos:', data);
    } catch (error) {
      console.error('Error durante el scraping:', error);
    }
  })();