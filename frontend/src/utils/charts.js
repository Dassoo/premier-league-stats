export const renderCustomAxisTick = (props) => {
    const { x, y, payload } = props;
    const teamName = payload.value;
    const logoPath = `/logos/${teamName.toLowerCase().replace(/\s+/g, "_")}.png`;
    return (
        <g transform={`translate(${x},${y})`}>
            <image href={logoPath} width="25" height="25" x="-30" y="-12" />
            <text x="-40" y="5" textAnchor="end" fill="white" fontSize="12">
                {teamName}
            </text>
        </g>
    );
};

// Custom dot with logo
export const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    if (!cx || !cy) return null;

    // For the LineChart name comes from dataKey, for the ScatterChart not
    const teamName = dataKey || payload.team;

    if (!teamName) return null;

    const teamLogo = `/logos/${teamName.toLowerCase().replace(/\s+/g, "_")}.png`;
    return (
        <image href={teamLogo} x={cx - 12} y={cy - 12} width="24" height="24" style={{
            filter: "drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))",
        }}/>
    );
};