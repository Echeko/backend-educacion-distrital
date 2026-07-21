const express = require('express');
const router = express.Router();
const pool = require('../db');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Reporte Excel
router.get('/excel', async (req, res) => {
  const result = await pool.query(
    `SELECT ue.nombre, ue.distrito, r.gestion, m.nombre AS materia, r.aprovechamiento, r.porcentaje_area
     FROM resultados_institucionales r
     JOIN unidades_educativas ue ON r.unidad_educativa_id = ue.id
     JOIN materias m ON r.materia_id = m.id`
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte');
  sheet.columns = [
    { header: 'Unidad Educativa', key: 'nombre', width: 25 },
    { header: 'Distrito', key: 'distrito', width: 15 },
    { header: 'Gestión', key: 'gestion', width: 10 },
    { header: 'Materia', key: 'materia', width: 20 },
    { header: 'Aprovechamiento', key: 'aprovechamiento', width: 15 },
    { header: 'Porcentaje Área', key: 'porcentaje_area', width: 15 },
  ];
  sheet.addRows(result.rows);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=Reporte.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

// Reporte PDF
router.get('/pdf', async (req, res) => {
  const result = await pool.query(
    `SELECT ue.nombre, ue.distrito, r.gestion, m.nombre AS materia, r.aprovechamiento, r.porcentaje_area
     FROM resultados_institucionales r
     JOIN unidades_educativas ue ON r.unidad_educativa_id = ue.id
     JOIN materias m ON r.materia_id = m.id`
  );

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=Reporte.pdf');
  doc.pipe(res);

  doc.fontSize(16).text('Reporte Institucional', { align: 'center' });
  doc.moveDown();

  result.rows.forEach(row => {
    doc.fontSize(12).text(
      `${row.nombre} | ${row.distrito} | Gestión: ${row.gestion} | ${row.materia} | Aprovechamiento: ${row.aprovechamiento} | % Área: ${row.porcentaje_area}`
    );
  });

  doc.end();
});

module.exports = router;
