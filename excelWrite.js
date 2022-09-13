const XLSX = require('xlsx')

function convertJsonToExcel(allProfile) {

    const workSheet = XLSX.utils.json_to_sheet(allProfile);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "contactInfo")
    // Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // Binary string
    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "contactInfo.xlsx")

}
 
module.exports = convertJsonToExcel;