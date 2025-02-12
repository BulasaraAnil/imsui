import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs';
import { getDrdoLogo, getLabDetails, getLogoImage } from 'services/qms.service';
const CarMasterPrint = async (data,iqaNo,auditeeName,schFromDate,schToDate) => {

  try {

    const labDetails = await getLabDetails();
    const logoImg = await getLogoImage();
    const drdoLogo = await getDrdoLogo();

    function formatDateToDDMMYY(date) {
      if (!date) return '-'; // Handle empty or invalid dates
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0'); // Day with leading zero
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Month with leading zero
      const year = String(d.getFullYear()).slice(-2); // Last two digits of the year
  
      return `${day}-${month}-${year}`;
  }
  
    const formattedschFromDate = dayjs(schFromDate).format('DD-MMM YYYY'); // Converts to 17-Mar 2024
     const formattedschToDate = dayjs(schToDate).format('DD-MMM YYYY'); 
 

    const getFormattedDate = () => {
      const date = new Date();
      const weekday = date.toLocaleString('en-IN', { weekday: 'short' });
      const month = date.toLocaleString('en-IN', { month: 'short' });
      const day = date.getDate();
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      const second = date.getSeconds().toString().padStart(2, '0');
      const timeZone = 'IST';

      return `${weekday} ${month} ${day} ${hour}:${minute}:${second} ${timeZone}`;
    };

    // Table body with headers
    let tableBody = [
      [
        { text: 'SN', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'CAR Ref No', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Description', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Action Plan', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Responsibility', bold: true, alignment: 'center', style: 'superheader' },
        { text: 'Target Date', bold: true, alignment: 'center', style: 'superheader' },
       
       ],
    ];


    data.forEach((item, index) => {
        if (item && Object.keys(item).length > 0) {
          tableBody.push([
            { text: index + 1, style: 'normal', alignment: 'center' },
            { text: item.carRefNo || '-', style: 'normal', alignment: 'center' },
            { text: item.carDescription || '-', style: 'normal', alignment: 'left' },
            { text: item.actionPlan || '-', style: 'normal', alignment: 'left' },
            { text: item.executiveName || '-', style: 'normal', alignment: 'left' },
            { text: formatDateToDDMMYY(item.targetDate), style: 'normal', alignment: 'left' }, // Format targetDate
          ]);
        }
      });
    
    

    // Define the PDF content
    let MyContent = [
      {
        style: 'tableExample',
        table: {
          widths: [20, 120, 190, 170, 160, 50],
          body: tableBody,
        },
        margin: [10, 10, 0, 10],
      },
    ];

    // Define the document structure and styles
    const docDefinition = {
      info: {
        title: `Master List of CAR Print`,
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 120, 40, 25],
 header: (currentPage) => {
        return {
          stack: [
            {
              columns: [
                {
                  image:
                    logoImg
                      ? `data:image/png;base64,${logoImg}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC',
                  width: 30,
                  height: 30,
                  alignment: 'left',
                  margin: [35, 15, 0, 10],
                },
                {
                  stack: [
                    {
                      text: `Electronics and Radar Development Establishment, CV Raman Nagar, Bangalore-560093`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 4],
                    },
                    {
                      text: ``,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                      margin: [0, 0, 0, 6],
                    },
                    {
                        text: `Master List of CAR - ${iqaNo}  -${auditeeName} - ${formattedschFromDate} - ${formattedschToDate}`,
                      style: 'superheader',
                      fontSize: 14,
                      alignment: 'center',
                    },
                  ],
                  margin: [0, 20, 20, 10],
                },
                {
                  image:
                    drdoLogo
                      ? `data:image/png;base64,${drdoLogo}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC',
                  width: 30,
                  height: 30,
                  alignment: 'right',
                  margin: [0, 15, 20, 10],
                },
              ],
            },
          ],
        };
      },
      content: MyContent,
      footer: (currentPage, pageCount) => {
        const currentDate = getFormattedDate();

        return [
          {
            columns: [
              { text: 'Printed By VEDTS-IMS', alignment: 'left', fontSize: 10 },
              {
                text: `Printed On: ${currentDate}   ${"\u00A0".repeat(12)} Page: ${currentPage} of ${pageCount}`,
                alignment: 'right',
                fontSize: 10,
                margin: [0, 0, 40, 0],
              },
            ],
            margin: [40, 0, 40, 100],
          },
        ];
      },
      styles: {
        headertable: {
          margin: [30, 20, 0, 30],
        },
        tableExample: {
          margin: [60, 2, 0, 5],
        },
        superheader: {
          fontSize: 12,
          bold: true,
        },
        normal: {
          fontSize: 12,
        },
        footer: {
          fontSize: 10,
          bold: true,
          border: [0, 0, 0, 0],
        },
      },
    };

    // Create and open the PDF document
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error('Error generating PDF: ', error);
  }
};

export default CarMasterPrint;
