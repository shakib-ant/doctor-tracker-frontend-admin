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

export const buildSvgLineChart = (data = [], width = 500, height = 180) => {
  if (!data || data.length === 0) {
    return { points: "", areaPoints: "", maxVal: 0, coords: [] };
  }

  const padding = 24;
  const maxVal = Math.max(...data.map((d) => d.count), 5);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const coords = data.map((item, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (item.count / maxVal) * (height - padding * 2);
    return { x, y, date: item.date, count: item.count };
  });

  const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const first = coords[0];
  const last = coords[coords.length - 1];
  const areaPoints = `${first.x},${height - padding} ${linePoints} ${last.x},${height - padding}`;

  return { linePoints, areaPoints, maxVal, coords };
};

export const CONDITION_COLORS = [
  "#89B4CE", // Medical blue
  "#86A8A1", // Sage
  "#A3B899", // Light sage
  "#6B8E9B", // Darker blue
  "#E8C170", // Amber accent
  "#C490D1", // Soft purple
];

