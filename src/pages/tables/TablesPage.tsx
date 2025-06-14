import React, { useState } from 'react';

interface TableProps {
  id: number;
  type: 'rect' | 'oval' | 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
  chairs: { cx: number; cy: number }[];
  color: string;
}

const tables: TableProps[] = [
  // Rectangle tables (brown)
  {
    id: 1,
    type: 'rect',
    x: 80,
    y: 80,
    width: 120,
    height: 60,
    color: '#a0522d',
    chairs: [
      { cx: 80, cy: 60 },
      { cx: 200, cy: 60 },
      { cx: 80, cy: 150 },
      { cx: 200, cy: 150 },
    ],
  },
  // Oval tables (green)
  {
    id: 2,
    type: 'oval',
    x: 300,
    y: 70,
    width: 140,
    height: 70,
    color: '#388e3c',
    chairs: [
      { cx: 300, cy: 55 },
      { cx: 370, cy: 50 },
      { cx: 440, cy: 55 },
      { cx: 320, cy: 140 },
      { cx: 420, cy: 140 },
    ],
  },
  // Diamond table (light brown)
  {
    id: 3,
    type: 'diamond',
    x: 600,
    y: 100,
    width: 80,
    height: 80,
    color: '#bc8f5a',
    chairs: [
      { cx: 640, cy: 100 }, // top
      { cx: 680, cy: 140 }, // right
      { cx: 640, cy: 180 }, // bottom
      { cx: 600, cy: 140 }, // left
    ],
  },
  // Small rectangle (dark green)
  {
    id: 4,
    type: 'rect',
    x: 150,
    y: 250,
    width: 80,
    height: 40,
    color: '#2e7d32',
    chairs: [
      { cx: 150, cy: 230 },
      { cx: 230, cy: 230 },
      { cx: 150, cy: 300 },
      { cx: 230, cy: 300 },
    ],
  },
  // Wide oval (olive)
  {
    id: 5,
    type: 'oval',
    x: 350,
    y: 250,
    width: 180,
    height: 60,
    color: '#8d8741',
    chairs: [
      { cx: 350, cy: 230 },
      { cx: 440, cy: 230 },
      { cx: 530, cy: 230 },
      { cx: 350, cy: 320 },
      { cx: 530, cy: 320 },
    ],
  },
  // Diamond (green)
  {
    id: 6,
    type: 'diamond',
    x: 650,
    y: 250,
    width: 60,
    height: 60,
    color: '#43a047',
    chairs: [
      { cx: 680, cy: 250 }, // top
      { cx: 710, cy: 280 }, // right
      { cx: 680, cy: 310 }, // bottom
      { cx: 650, cy: 280 }, // left
    ],
  },
  // Large rectangle (sienna)
  {
    id: 7,
    type: 'rect',
    x: 80,
    y: 400,
    width: 160,
    height: 70,
    color: '#a0522d',
    chairs: [
      { cx: 80, cy: 380 },
      { cx: 240, cy: 380 },
      { cx: 80, cy: 490 },
      { cx: 240, cy: 490 },
      { cx: 160, cy: 470 },
    ],
  },
  // Small oval (light green)
  {
    id: 8,
    type: 'oval',
    x: 320,
    y: 400,
    width: 80,
    height: 40,
    color: '#a5d6a7',
    chairs: [
      { cx: 320, cy: 390 },
      { cx: 360, cy: 390 },
      { cx: 400, cy: 390 },
      { cx: 320, cy: 450 },
      { cx: 400, cy: 450 },
    ],
  },
  // Diamond (tan)
  {
    id: 9,
    type: 'diamond',
    x: 500,
    y: 400,
    width: 70,
    height: 70,
    color: '#d2b48c',
    chairs: [
      { cx: 535, cy: 400 }, // top
      { cx: 570, cy: 435 }, // right
      { cx: 535, cy: 470 }, // bottom
      { cx: 500, cy: 435 }, // left
    ],
  },
  // Rectangle (olive)
  {
    id: 10,
    type: 'rect',
    x: 650,
    y: 400,
    width: 100,
    height: 50,
    color: '#8d8741',
    chairs: [
      { cx: 650, cy: 380 },
      { cx: 750, cy: 380 },
      { cx: 650, cy: 470 },
      { cx: 750, cy: 470 },
    ],
  },
  // Oval (dark green)
  {
    id: 11,
    type: 'oval',
    x: 800,
    y: 250,
    width: 120,
    height: 60,
    color: '#388e3c',
    chairs: [
      { cx: 800, cy: 230 },
      { cx: 860, cy: 230 },
      { cx: 920, cy: 230 },
      { cx: 800, cy: 310 },
      { cx: 920, cy: 310 },
    ],
  },
  // Diamond (brown)
  {
    id: 12,
    type: 'diamond',
    x: 900,
    y: 100,
    width: 60,
    height: 60,
    color: '#a0522d',
    chairs: [
      { cx: 930, cy: 100 }, // top
      { cx: 960, cy: 130 }, // right
      { cx: 930, cy: 160 }, // bottom
      { cx: 900, cy: 130 }, // left
    ],
  },
];

const TablesPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const handleTableClick = (id: number) => {
    setSelectedTable(id);
  };

  return (
    <div className="p-4">
      <h1 className="h1 mb-4">Table Layout</h1>
      <div
        className="w-full overflow-x-auto bg-papaya-whip"
        style={{ minHeight: 520 }}
      >
        <svg
          viewBox="0 0 1100 600"
          width="100%"
          height="500"
          style={{
            background: '#B4B9C5',
            minWidth: 900,
            minHeight: 500,
            display: 'block',
          }}
        >
          {tables.map((table) => {
            let shape = null;
            if (table.type === 'rect') {
              shape = (
                <rect
                  x={table.x}
                  y={table.y}
                  width={table.width}
                  height={table.height}
                  fill={table.color}
                  stroke="#333"
                  strokeWidth={3}
                  rx={12}
                />
              );
            } else if (table.type === 'oval') {
              shape = (
                <ellipse
                  cx={table.x + table.width / 2}
                  cy={table.y + table.height / 2}
                  rx={table.width / 2}
                  ry={table.height / 2}
                  fill={table.color}
                  stroke="#333"
                  strokeWidth={3}
                />
              );
            } else if (table.type === 'diamond') {
              const cx = table.x + table.width / 2;
              const cy = table.y + table.height / 2;
              const w = table.width / 2;
              const h = table.height / 2;
              shape = (
                <polygon
                  points={`
                    ${cx},${cy - h}
                    ${cx + w},${cy}
                    ${cx},${cy + h}
                    ${cx - w},${cy}
                  `}
                  fill={table.color}
                  stroke="#333"
                  strokeWidth={3}
                />
              );
            }
            return (
              <g
                key={table.id}
                onClick={() => handleTableClick(table.id)}
                style={{ cursor: 'pointer' }}
              >
                {shape}
                {table.chairs.map((chair, index) => (
                  <circle
                    key={index}
                    cx={chair.cx}
                    cy={chair.cy}
                    r="12"
                    fill="#e0cda9"
                    stroke="#333"
                    strokeWidth={2}
                  />
                ))}
                <text
                  x={
                    table.type === 'oval'
                      ? table.x + table.width / 2
                      : table.x + table.width / 2
                  }
                  y={
                    table.type === 'oval'
                      ? table.y + table.height / 2
                      : table.y + table.height / 2
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="1.5rem"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  {table.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {selectedTable && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setSelectedTable(null)}
            style={{
              position: 'absolute',
              top: '0px',
              right: '5px',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <h2>Table {selectedTable} Order Overview</h2>
          <p>Order details will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default TablesPage;
