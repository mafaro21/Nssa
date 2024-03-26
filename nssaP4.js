const XLSX = require('xlsx');
const readline = require('readline');
// import XLSX from 'xlsx/xlsx';
// import sourceFile from 'NSSA P4 CHICKEN INN FC.Xls'
// import destinationFile from './P4/TempChik.xlsx'

function consolidateExcelFiles(sourceFile, destinationFile, res) {
    const sourceWorkbook = XLSX.readFile(sourceFile);
    const destinationWorkbook = XLSX.readFile(destinationFile);

    // Assuming both files have only one sheet but if not this is where to change the sheets
    const sourceSheetName = sourceWorkbook.SheetNames[0];
    const destinationSheetName = destinationWorkbook.SheetNames[0];
    // console.log('\n' + sourceFile + ' has ' + sourceSheetName + ' sheet(s) select the one you want to use: ')
    // console.log(sourceWorkbook.SheetNames)
    // console.log('destination sheet', destinationSheetName)
    // console.log('\n' + destinationFile + ' has ' + destinationSheetName + ' sheet(s) select the one you want to use: ')
    // console.log(destinationWorkbook.SheetNames)

    const sourceWorksheet = sourceWorkbook.Sheets[sourceSheetName];
    const destinationWorksheet = destinationWorkbook.Sheets[destinationSheetName];
    // console.log('source worksheet', sourceWorksheet)
    // console.log('source worksheet', destinationWorksheet)

    // Convert sheets to JSON objects
    const sourceData = XLSX.utils.sheet_to_json(sourceWorksheet, {
        defval: "N/A",
    });
    const destinationData = XLSX.utils.sheet_to_json(destinationWorksheet, {
        defval: "N/A",
    });
    // console.log(sourceData[0].NationalIDNumber)

    // const sourceColumnIndex = sourceData[0].NationalIDNumber;
    // const destinationColumnIndex = destinationData[0].NationalIDNumber;
    // console.log(sourceColumnIndex)

    const preMatchedRows = []
    const matchedRows = [];
    const notRegistered = [];
    const terminated = [];

    let nonMatching = 0

    //matching
    for (let i = 0; i < sourceData.length; i++) {
        const sourceCellValue = sourceData[i].NationalIDNumber.replace(/-/g, "");
        const sourceSurname = sourceData[i].Surname;
        const sourceFirst = sourceData[i].Firstname;
        const sourceBirth = sourceData[i].BirthDate;
        const sourceStart = sourceData[i].StartDate;
        const sourceName1 = sourceData[i].Firstname + sourceData[i].Surname
        const sourceName = sourceName1.toUpperCase()
        let foundMatch = false

        // console.log(sourceCellValue)

        for (let j = 0; j < destinationData.length; j++) {
            // console.log(destinationData[j].NationalIDNumber.length)


            const destinationCellValue = destinationData[j].NationalIDNumber.replace(/-/g, "")
            const destinationSurname = destinationData[j].Surname;
            const destinationFirst = destinationData[j].Firstname;
            const destinationBirth = destinationData[j].BirthDate;
            const destinationStart = destinationData[j].StartDate;
            const destinationName1 = destinationData[j].Firstname + destinationData[j].Surname
            const destinationName = destinationName1.toUpperCase()
            //sourceCellValue === destinationCellValue || sourceSurname === destinationSurname || sourceBirth === destinationBirth

            // console.log(destinationCellValue)

            // if (destinationCellValue.match(/^undefined/g)) {
            //     console.log('value is empty')
            // }

            if (sourceCellValue === destinationCellValue) {
                preMatchedRows.push(sourceData[i])
                // matchedRows.push(sourceData[i]);

                if (sourceName === destinationName) {
                    matchedRows.push(sourceData[i]);
                    foundMatch = true
                    // nonMatching++
                    // console.log(nonMatching)
                }

                break;
            }

        }
        if (!foundMatch) {
            notRegistered.push(sourceData[i]);
        }


    }

    //in destination but not source
    const otherPreMatched = []
    for (let i = 0; i < destinationData.length; i++) {
        const destinationCellValue = destinationData[i].NationalIDNumber.replace(/-/g, "");
        const destinationSurname = destinationData[i].Surname;
        const destinationFirst = destinationData[i].Firstname;
        const destinationBirth = destinationData[i].BirthDate;
        const destinationStart = destinationData[i].StartDate;
        const destinationName1 = destinationData[i].Firstname + destinationData[i].Surname
        const destinationName = destinationName1.toUpperCase()
        let foundMatch = false;
        for (let j = 0; j < sourceData.length; j++) {
            const sourceCellValue = sourceData[j].NationalIDNumber.replace(/-/g, "");
            const sourceSurname = sourceData[j].Surname;
            const sourceFirst = sourceData[j].Firstname;
            const sourceBirth = sourceData[j].BirthDate;
            const sourceStart = sourceData[j].StartDate;
            const sourceName1 = sourceData[j].Firstname + sourceData[j].Surname
            const sourceName = sourceName1.toUpperCase()
            //destinationCellValue === sourceCellValue || sourceSurname === destinationSurname || sourceBirth === destinationBirth

            if (destinationCellValue === sourceCellValue || destinationName === sourceName) {
                foundMatch = true;
                break;
            }
        }
        if (!foundMatch) {
            terminated.push(destinationData[i]);
        }
        if (destinationCellValue === '') {
            console.log(destinationData[i].Surname + ' missing id')
        }
    }

    // Create workbooks for exporting
    const consolidated = XLSX.utils.book_new();
    const notRegisteredWorkbook = XLSX.utils.book_new();
    const terminatedWorkbook = XLSX.utils.book_new();

    // Create worksheets for exporting
    const consolidatedWorksheet = XLSX.utils.json_to_sheet([...matchedRows]);
    const notRegisteredWorksheet = XLSX.utils.json_to_sheet([...notRegistered]);
    const terminatedWorksheet = XLSX.utils.json_to_sheet([...terminated]);

    // Add worksheets to workbooks
    XLSX.utils.book_append_sheet(consolidated, consolidatedWorksheet, destinationSheetName);
    XLSX.utils.book_append_sheet(notRegisteredWorkbook, notRegisteredWorksheet, 'Not-Registered');
    XLSX.utils.book_append_sheet(terminatedWorkbook, terminatedWorksheet, 'Terminated');

    // Write to files
    XLSX.writeFile(consolidated, 'Consolidated.xlsx')
    XLSX.writeFile(notRegisteredWorkbook, 'Not-Registered.xlsx');
    XLSX.writeFile(terminatedWorkbook, 'Terminated.xlsx');

    console.log('Exported Consolidated.xlsx, Not-Registered.xlsx and Terminated.xlsx');
    res.send('Exported Consolidated.xlsx, Not-Registered.xlsx and Terminated.xlsx');
    // res.sendFile('./Consolidated.xlsx')

}


module.exports = { consolidateExcelFiles }
