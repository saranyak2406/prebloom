const { query } = require('./db');

async function mapSubjects() {
  const allMappings = [
    [1, [1, 2, 3, 4, 7]], // UPSC CSE: Polity, Economy, History, Geography, Sci
    [2, [3, 4, 5, 7]],    // NDA: History, Geography, Quant, Sci
    [3, [1, 3, 4, 5, 6, 7]], // SSC CGL: Polity, History, Geo, Quant, Reasoning, Sci
    [4, [3, 4, 5, 6, 7]], // SSC CHSL: History, Geo, Quant, Reasoning, Sci
    [5, [1, 2, 3, 4, 6, 7, 8]], // APPSC Group 1: Polity, Economy, History, Geo, Reasoning, Sci, AP GK
    [6, [1, 2, 3, 4, 6, 8]], // APPSC Group 2: Polity, Economy, History, Geo, Reasoning, AP GK
    [7, [3, 4, 5, 6, 7]], // RRB NTPC: History, Geo, Quant, Reasoning, Sci
    [8, [2, 5, 6]],       // IBPS PO: Economy, Quant, Reasoning
    [9, [2, 5, 6]],       // SBI PO: Economy, Quant, Reasoning
    [10, [3, 4, 5, 6, 7]], // AFCAT: History, Geo, Quant, Reasoning, Sci
    [11, [1, 2, 3, 4, 5, 6, 8]], // AP Police SI: Polity, Economy, History, Geo, Quant, Reasoning, AP GK
    [12, [5, 6, 7]]       // CTET: Quant, Reasoning, Sci
  ];

  for (const [examId, subIds] of allMappings) {
    for (const subId of subIds) {
      const exists = await query('SELECT 1 FROM exam_subjects WHERE exam_id = $1 AND subject_id = $2', [examId, subId]);
      if (exists.rows.length === 0) {
        await query('INSERT INTO exam_subjects (exam_id, subject_id, weightage) VALUES ($1, $2, 20)', [examId, subId]);
      }
    }
  }

  console.log('✅ Subject mapping completed successfully for all 12 examinations!');
}

mapSubjects().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
