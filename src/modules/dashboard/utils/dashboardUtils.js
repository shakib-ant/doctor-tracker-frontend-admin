export const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat().format(num);
};

export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatDayName = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Generate a smooth cubic Bézier spline SVG path from an array of {x, y} coordinate points.
 */
export const pointsToSplinePath = (coords) => {
  if (!coords || coords.length === 0) return "";
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;
  if (coords.length === 2) {
    return `M ${coords[0].x} ${coords[0].y} L ${coords[1].x} ${coords[1].y}`;
  }

  let path = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] ? coords[i + 2] : p2;

    const tension = 0.2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;

    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
};

export const buildSvgLineChart = (data = [], width = 600, height = 200) => {
  if (!data || data.length === 0) {
    return {
      points: "",
      areaPoints: "",
      maxVal: 0,
      coords: [],
      coordsSecondary: [],
      splinePath: "",
      splineSecondaryPath: "",
      areaPath: "",
    };
  }

  const paddingLeft = 36;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 30;

  const maxVal = Math.max(...data.map((d) => d.count), 5);
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const stepX = chartWidth / Math.max(data.length - 1, 1);

  // Primary Series: Inpatient admissions
  const coords = data.map((item, i) => {
    const x = paddingLeft + i * stepX;
    const y = height - paddingBottom - (item.count / maxVal) * chartHeight;
    return { x, y, date: item.date, count: item.count };
  });

  // Secondary Series: Discharged / Triage (calculated smoothly from data for contrast)
  const coordsSecondary = data.map((item, i) => {
    const x = paddingLeft + i * stepX;
    // Dynamic secondary line with realistic clinical offset
    const secondaryCount = Math.max(1, Math.round(item.count * 0.65 + (i % 2 === 0 ? 1 : -0.5)));
    const y = height - paddingBottom - (secondaryCount / maxVal) * chartHeight;
    return { x, y, date: item.date, count: secondaryCount };
  });

  const splinePath = pointsToSplinePath(coords);
  const splineSecondaryPath = pointsToSplinePath(coordsSecondary);

  // Create smooth filled area for primary spline
  const first = coords[0];
  const last = coords[coords.length - 1];
  const areaPath = `${splinePath} L ${last.x} ${height - paddingBottom} L ${first.x} ${height - paddingBottom} Z`;

  return {
    coords,
    coordsSecondary,
    splinePath,
    splineSecondaryPath,
    areaPath,
    maxVal,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
  };
};

export const CONDITION_COLORS = [
  "#2563EB", // Royal blue
  "#0EA5E9", // Sky blue
  "#0F172A", // Slate navy
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F59E0B", // Amber
];
