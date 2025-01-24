import puppeteer from 'puppeteer';

const scrapePeajes = async () => {
  // 1. Configuración del navegador y página
  const browser = await puppeteer.launch({
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Ruta al ejecutable de Chrome
    headless: true, // headless = true para ejecución sin interfaz gráfica
  });
  const page = await browser.newPage();

  // 2. Navegar al sitio web
  const url =
    'https://www.argentina.gob.ar/transporte/vialidad-nacional/institucional/informacion-publica/tarifas-de-peajes';
  await page.goto(url, { waitUntil: 'domcontentloaded' }); // Espera a que el DOM esté cargado

  let peajes = [];
  let hasNextPage = true;

  while (hasNextPage) {
    // 3. Esperar hasta que la tabla esté cargada
    await page.waitForSelector('table');

    // 4. Extraer datos de la tabla actual
    const currentPageData = await page.evaluate(() => {
      const table = document.querySelector('table');
      if (!table) return [];

      // Obtener encabezados
      const headers = Array.from(table.querySelectorAll('thead tr th')).map(
        (th) => th.textContent?.trim()
      );

      // Obtener filas de datos
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      return rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = cells[index]?.textContent?.trim() || null;
        });
        return rowData;
      });
    });

    // Agregar los datos de la página actual al array principal
    peajes = peajes.concat(currentPageData);

    // 5. Verificar si hay una siguiente página y navegar
    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector('.pagination .next');
      if (nextButton && !nextButton.classList.contains('disabled')) {
        nextButton.click();
        return true;
      }
      return false;
    });

    // Esperar un momento para que la nueva página cargue
    if (hasNextPage) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // 6. Cerrar el navegador
  await browser.close();

  return peajes;
};

export default scrapePeajes;
