export const initialNodes = [
  { id: 'boss_init', position: { x: 400, y: 0 }, data: { label: 'boss_init' } },

  { id: 'metadata_agent', position: { x: 100, y: 120 }, data: { label: 'metadata_agent' } },
  { id: 'paper_analyzer', position: { x: 500, y: 120 }, data: { label: 'paper_analyzer' } },

  { id: 'review_analysis', position: { x: 500, y: 240 }, data: { label: 'review_analysis' } },
  { id: 'retry_analysis', position: { x: 750, y: 240 }, data: { label: 'retry_analysis' } },

  { id: 'summary_agent', position: { x: 350, y: 360 }, data: { label: 'summary_agent' } },
  { id: 'review_summary', position: { x: 350, y: 480 }, data: { label: 'review_summary' } },
  { id: 'retry_summary', position: { x: 150, y: 480 }, data: { label: 'retry_summary' } },

  { id: 'citation_agent', position: { x: 650, y: 360 }, data: { label: 'citation_agent' } },
  { id: 'review_citations', position: { x: 650, y: 480 }, data: { label: 'review_citations' } },
  { id: 'retry_citations', position: { x: 850, y: 480 }, data: { label: 'retry_citations' } },

  { id: 'insights_agent', position: { x: 350, y: 600 }, data: { label: 'insights_agent' } },
  { id: 'review_insights', position: { x: 350, y: 720 }, data: { label: 'review_insights' } },
  { id: 'retry_insights', position: { x: 150, y: 720 }, data: { label: 'retry_insights' } },

  { id: 'boss_combine', position: { x: 500, y: 840 }, data: { label: 'boss_combine' } },
];

export const initialEdges = [
  { id: 'e1', source: 'boss_init', target: 'metadata_agent' },
  { id: 'e2', source: 'boss_init', target: 'paper_analyzer' },
  { id: 'e3', source: 'metadata_agent', target: 'boss_combine' },

  { id: 'e4', source: 'paper_analyzer', target: 'review_analysis' },
  { id: 'e5', source: 'review_analysis', target: 'retry_analysis', label: 'low score' },
  { id: 'e6', source: 'retry_analysis', target: 'paper_analyzer' },
  { id: 'e7', source: 'review_analysis', target: 'summary_agent', label: 'approved' },
  { id: 'e8', source: 'review_analysis', target: 'citation_agent', label: 'approved' },

  { id: 'e9', source: 'summary_agent', target: 'review_summary' },
  { id: 'e10', source: 'review_summary', target: 'retry_summary', label: 'low score' },
  { id: 'e11', source: 'retry_summary', target: 'summary_agent' },
  { id: 'e12', source: 'review_summary', target: 'insights_agent', label: 'approved' },

  { id: 'e13', source: 'insights_agent', target: 'review_insights' },
  { id: 'e14', source: 'review_insights', target: 'retry_insights', label: 'low score' },
  { id: 'e15', source: 'retry_insights', target: 'insights_agent' },
  { id: 'e16', source: 'review_insights', target: 'boss_combine', label: 'approved' },

  { id: 'e17', source: 'citation_agent', target: 'review_citations' },
  { id: 'e18', source: 'review_citations', target: 'retry_citations', label: 'low score' },
  { id: 'e19', source: 'retry_citations', target: 'citation_agent' },
  { id: 'e20', source: 'review_citations', target: 'boss_combine', label: 'approved' },
];