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
  //    TODO: usar env para la pagina
  const url =
    'https://www.argentina.gob.ar/transporte/vialidad-nacional/institucional/informacion-publica/tarifas-de-peajes';
  await page.goto(url, { waitUntil: 'domcontentloaded' }); // Espera a que el DOM esté cargado

  // 3. Esperar elementos específicos
  await page.waitForSelector('table');

  //   // 4. Extraer los datos
  //   const peajes = await page.evaluate(() => {
  //     // Seleccionar todas las filas de la tabla
  //     const rows = Array.from(document.querySelectorAll('table tr'));

  //     // Convertir las filas a objetos con la información relevante
  //     return rows
  //       .map((row) => {
  //         const columns = row.querySelectorAll('td');
  //         console.log("🐳 ~ .map ~ columns:", columns)
  //         return {
  //           nombre: columns[0]?.textContent?.trim() || null,
  //           categoria: columns[1]?.textContent?.trim() || null,
  //           tarifa: columns[2]?.textContent?.trim() || null,
  //         };
  //       })
  //       .filter((item) => item.nombre); // Filtra filas vacías o encabezados
  //   });

  // 4. Extraer datos de la tabla
  const peajes = await page.evaluate(() => {
    // Seleccionar la tabla
    const table = document.querySelector('table');
    if (!table) return [];

    // Obtener los encabezados
    const headers = Array.from(table.querySelectorAll('thead tr th')).map(
      (th) => th.textContent?.trim()
    );

    // Obtener las filas de datos
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    // Mapear las filas a objetos con claves de los encabezados
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = cells[index]?.textContent?.trim() || null;
      });
      return rowData;
    });
  });

  // 5. Cerrar el navegador
  await browser.close();

  return peajes;
};

export default scrapePeajes;
//
