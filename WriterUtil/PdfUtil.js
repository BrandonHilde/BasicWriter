
var yPos = 20;

function SaveToPDF(contentDiv, filename) {
    
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    var nodes = contentDiv.children;

    yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    for (const child of contentDiv.childNodes) {
        processElement(doc, child, contentWidth, margin);
    }
    
    // Save the PDF
    doc.save(filename + '.pdf');
}

function processElement(doc, element, contentWidth, margin, indent = 0) {
    // Skip empty text nodes
    if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim();
        if (text) {
            const splitText = doc.splitTextToSize(text, contentWidth - (indent * 5));
            doc.text(splitText, margin + (indent * 5), yPos);
            yPos += splitText.length * 7;
        }
        return;
    }
    
    // Process element based on its tag
    switch (element.tagName) {
        case 'H1':
        case 'H2':
        case 'H3':
        case 'H4':
        case 'H5':
        case 'H6':
            const headingSize = 20 - (parseInt(element.tagName.substring(1)) * 2);
            doc.setFontSize(headingSize);
            doc.setFont(undefined, 'bold');
            const headingText = element.textContent.trim();
            if (headingText) {
                const splitHeading = doc.splitTextToSize(headingText, contentWidth - (indent * 5));
                doc.text(splitHeading, margin + (indent * 5), yPos);
                yPos += splitHeading.length * 7 + 3;
            }
            doc.setFont(undefined, 'normal');
            doc.setFontSize(12);
            break;
            
        case 'P':
            doc.setFontSize(12);
            // Check if paragraph is empty
            if (element.textContent.trim()) {
                // Process all child nodes to handle formatting
                for (const child of element.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const text = child.textContent.trim();
                        if (text) {
                            const splitText = doc.splitTextToSize(text, contentWidth - (indent * 5));
                            doc.text(splitText, margin + (indent * 5), yPos);
                            yPos += splitText.length * 7;
                        }
                    } else if (child.tagName === 'STRONG' || child.tagName === 'B') {
                        doc.setFont(undefined, 'bold');
                        const text = child.textContent.trim();
                        if (text) {
                            const splitText = doc.splitTextToSize(text, contentWidth - (indent * 5));
                            doc.text(splitText, margin + (indent * 5), yPos);
                            yPos += splitText.length * 7;
                        }
                        doc.setFont(undefined, 'normal');
                    } else if (child.tagName === 'EM' || child.tagName === 'I') {
                        doc.setFont(undefined, 'italic');
                        const text = child.textContent.trim();
                        if (text) {
                            const splitText = doc.splitTextToSize(text, contentWidth - (indent * 5));
                            doc.text(splitText, margin + (indent * 5), yPos);
                            yPos += splitText.length * 7;
                        }
                        doc.setFont(undefined, 'normal');
                    } else {
                        processElement(child, indent);
                    }
                }
                yPos += 3; // Add some space after paragraph
            }
            break;
            
        case 'HR':
            // Draw a line
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 5;
            break;
            
        case 'TABLE':
            // Process table using jspdf-autotable
            const tableData = [];
            const tableHeaders = [];
            
            // Get headers
            const headerRow = element.querySelector('thead tr');
            if (headerRow) {
                for (const th of headerRow.querySelectorAll('th')) {
                    tableHeaders.push(th.textContent.trim());
                }
            }
            
            // Get data rows
            const rows = element.querySelectorAll('tbody tr');
            for (const row of rows) {
                const rowData = [];
                for (const cell of row.querySelectorAll('td')) {
                    rowData.push(cell.textContent.trim());
                }
                tableData.push(rowData);
            }
            
            // Add table to PDF
            if (tableData.length > 0) {
                doc.autoTable({
                    head: tableHeaders.length > 0 ? [tableHeaders] : undefined,
                    body: tableData,
                    startY: yPos,
                    margin: { left: margin + (indent * 5), right: margin },
                    theme: 'grid'
                });
                
                // Update position after table
                yPos = doc.lastAutoTable.finalY + 5;
            }
            break;
            
        case 'UL':
        case 'OL':
            // Process list items
            const items = element.querySelectorAll('li');
            let itemNumber = 1;
            for (const item of items) {
                doc.setFontSize(12);
                const bullet = element.tagName === 'UL' ? '• ' : `${itemNumber}. `;
                itemNumber++;
                
                const itemText = item.textContent.trim();
                if (itemText) {
                    const splitText = doc.splitTextToSize(itemText, contentWidth - (indent * 5) - 7);
                    doc.text(bullet, margin + (indent * 5), yPos);
                    doc.text(splitText, margin + (indent * 5) + 7, yPos);
                    yPos += splitText.length * 7 + 2;
                }
            }
            yPos += 3; // Add some space after list
            break;
            
        default:
            // Process all child nodes for other elements
           
            if(element)
            {
                for (const child of element.childNodes) {
                    processElement(doc, child, contentWidth, margin, indent);
                }
        }
    }
}