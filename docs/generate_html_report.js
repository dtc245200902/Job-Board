const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'BAO_CAO_THUC_HANH_DE33_dtc245200902.md');
const htmlPath = path.join(__dirname, 'BAO_CAO_THUC_HANH_DE33_dtc245200902.html');

let md = fs.readFileSync(mdPath, 'utf8');

// Basic markdown to HTML converter for professional printable document
function convertMarkdownToHtml(content) {
    let html = content
        .replace(/\\newpage/g, '<div class="page-break"></div>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    return html;
}

const bodyHtml = convertMarkdownToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo Cáo Thực Hành Đề 33 - dtc245200902</title>
    <link href="https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4;
            margin: 20mm 20mm 20mm 25mm;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 20px 40px;
        }
        h1, h2, h3, h4 {
            font-family: 'Times New Roman', serif;
            color: #002b49;
            font-weight: bold;
        }
        h1 { font-size: 18pt; text-align: center; margin-top: 1.5rem; text-transform: uppercase; }
        h2 { font-size: 15pt; margin-top: 1.25rem; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        h3 { font-size: 13.5pt; margin-top: 1rem; }
        p { text-align: justify; margin: 0.5rem 0; text-indent: 1cm; }
        ul, ol { margin: 0.5rem 0 0.5rem 1.5rem; }
        li { margin-bottom: 0.35rem; }
        pre {
            background: #f4f6f8;
            border: 1px solid #dcdfe4;
            padding: 12px;
            border-radius: 4px;
            font-family: Consolas, monospace;
            font-size: 10pt;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        code {
            background: #edf2f7;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: Consolas, monospace;
            font-size: 11pt;
            color: #b91c1c;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 11.5pt;
        }
        table, th, td {
            border: 1px solid #333;
        }
        th, td {
            padding: 8px 10px;
            text-align: left;
        }
        th {
            background: #e2e8f0;
            font-weight: bold;
        }
        .page-break {
            page-break-after: always;
            break-after: page;
            height: 0;
            margin: 0;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
        .print-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #002b49;
            color: #fff;
            padding: 12px 24px;
            border-radius: 30px;
            font-family: sans-serif;
            font-weight: bold;
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">In Báo Cáo / Xuất PDF</button>
    ${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('Successfully generated HTML report at:', htmlPath);
