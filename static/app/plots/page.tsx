"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { CustomDot } from "@/utils/charts";
import { TooltipProps, TeamStats } from "@/utils/helpers";

export default function Plots() {
    const [year] = useState(new Date().getFullYear());
    const [stats, setStats] = useState<TeamStats[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    const [selectedStat, setSelectedStat] = useState("goals");
    const [showLogos, setShowLogos] = useState(true);

    // Variables for second plot
    const [selectedSeason, setSelectedSeason] = useState<string>("goals");
    const [selectedStat1, setSelectedStat1] = useState<string>("goals");
    const [selectedStat2, setSelectedStat2] = useState<string>("total_pass");


    useEffect(() => {
        fetch(`https://premier-league-stats-gk6r.onrender.com/api/stats/data/?season=${selectedSeason}`)
            .then((res) => res.json())
            .then((data: TeamStats[]) => {
                console.log("Dati ricevuti:", data);
                setStats(data);
            })
            .catch((err) => console.error("Errore nel fetch dati:", err));
    }, [selectedSeason]);

    // Get available seasons and teams
    const teams = [...new Set(stats.map((team) => team.team))].sort();
    const seasons = [...new Set(stats.map((team) => team.season))].sort();

    const statOptions = [
        { value: "wins", label: "Wins" },
        { value: "losses", label: "Losses" },
        { value: "goals", label: "Goals" },
        { value: "goals_conceded", label: "Conceded Goals" },
        { value: "total_yel_card", label: "Yellow Cards" },
        { value: "total_red_card", label: "Red Cards" },
        { value: "total_scoring_att", label: "Shots" },
        { value: "ontarget_scoring_att", label: "Ontarget Shots" },
        { value: "hit_woodwork", label: "Woodwork Hits" },
        { value: "att_hd_goal", label: "Header Goals" },
        { value: "att_pen_goal", label: "Penalty Goals" },
        { value: "att_freekick_goal", label: "Freekick Goals" },
        { value: "att_ibox_goal", label: "Inside Box Goals" },
        { value: "att_obox_goal", label: "Outside Box Goals" },
        { value: "goal_fastbreak", label: "Fastbreak Goals" },
        { value: "total_offside", label: "Offsides" },
        { value: "clean_sheet", label: "Clean Sheets" },
        { value: "outfielder_block", label: "Outfielder Blocks" },
        { value: "interception", label: "Interceptions" },
        { value: "total_tackle", label: "Tackles" },
        { value: "last_man_tackle", label: "Last Man Tackles" },
        { value: "total_clearance", label: "Clearances" },
        { value: "head_clearance", label: "Head Clearances" },
        { value: "own_goals", label: "Own Goals" },
        { value: "penalty_conceded", label: "Conceded Penalties" },
        { value: "pen_goals_conceded", label: "Conceded Penalty Goals" },
        { value: "total_pass", label: "Passes" },
        { value: "total_through_ball", label: "Through Balls" },
        { value: "total_long_balls", label: "Long Balls" },
        { value: "backward_pass", label: "Backward Passes" },
        { value: "total_cross", label: "Crosses" },
        { value: "corner_taken", label: "Corners Taken" },
        { value: "touches", label: "Touches" },
        { value: "big_chance_missed", label: "Big Chances Missed" },
        { value: "clearance_off_line", label: "Clearances Off Line" },
        { value: "dispossessed", label: "Dispossessments" },
        { value: "penalty_save", label: "Saved Penalties" },
        { value: "total_high_claim", label: "High Claims (Keeper)" },
    ];

    // Map for ScatterChart custom tooltip
    const statLabelMap = Object.fromEntries(statOptions.map(({ value, label }) => [value, label]));   

    // Organize data for the first plot (teams over multiple seasons)
    const structuredData = seasons.map((season) => {
        const sData: Record<string, string | number | null> = { season };
    
        selectedTeams.forEach((team) => {
            const teamData = stats.find((entry) => entry.team === team && entry.season === season);
            sData[team] = teamData ? teamData[selectedStat] : null;
        });
    
        return sData;
    });

    // Organize data for the second plot (all teams in a selected season)
    const filteredData = stats
        .filter((entry) => entry.season === selectedSeason)
        .map((entry) => ({
            team: entry.team,
            x: entry[selectedStat1] as number || 0,
            y: entry[selectedStat2] as number || 0,
        }))
        .sort((a, b) => a.x - b.x);


    // Team selection
    const handleTeamSelection = (team: string) => {
        setSelectedTeams((prev) =>
            prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
        );
    };
    

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
                    <p className="font-bold">{data.team}</p>
                    <p>{statLabelMap[selectedStat1]}: {data.x}</p>
                    <p>{statLabelMap[selectedStat2]}: {data.y}</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a011c] to-purple-950 text-white flex flex-col items-center p-6 font-[Radikal-bold]">
            
            {/* Navbar */}
            <nav className="flex items-center justify-between flex-wrap bg-transparent p-6 w-full max-w-6xl">
                <div className="flex items-center flex-shrink-0 text-white">
                    <img src="/logos/premier_league.png" alt="Premier League" className="w-20 h-20 object-contain brightness-200" />
                    <Link href="/" className="font-semibold text-xl tracking-tight hover:text-[#821090] transition">Premier League Stats (2006-2018)</Link>
                </div>

                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-md lg:flex-grow text-right">
                        <Link href="/standings" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition mr-6">
                            Standings
                        </Link>
                        <Link href="/stats" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition mr-6">
                            Stats
                        </Link>
                        <Link href="/plots" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition">
                            Plots
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-4xl font-bold text-center text-white main-title">
                    Seasonal Trend
                </h1>
            </div>
            <p className="flex text-gray-300 items-center gap-4 mb-6 max-w-4xl">
                Compare stats of different teams over the 2006-2018 season range.
            </p>


            {/* Filters */}
            <div className="flex gap-4 mb-6 max-w-4xl">
                <div>
                    <p>Select teams:</p>
                    <select
                        className="p-2 bg-[#280137] text-white rounded"
                        onChange={(e) => {
                            if (e.target.value === "all") {
                                setSelectedTeams(teams);
                            } else if (e.target.value === "none") {
                                setSelectedTeams([]);
                            } else {
                                handleTeamSelection(e.target.value);
                            }
                        }}
                        value=""
                    >
                        <option value="">-- Select --</option>
                        <option value="all">[Select All Teams]</option>
                        <option value="none">[Remove All Teams]</option>
                        {teams.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTeams.map((team) => (
                            <span key={team} className="bg-[#821090] text-white px-3 py-1 rounded-lg">
                                {team} <button onClick={() => handleTeamSelection(team)}>✖</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p>Select stat:</p>
                    <select
                        className="p-2 bg-[#280137] text-white rounded"
                        value={selectedStat}
                        onChange={(e) => setSelectedStat(e.target.value)}
                    >
                        {statOptions.map(stat => (
                            <option key={stat.value} value={stat.value}>{stat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Line Chart */}
            <div className="w-full max-w-4xl h-96 bg-[#280137] p-6 rounded-lg shadow-lg">
                {selectedTeams.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={structuredData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="season" stroke="white" />
                            <YAxis stroke="white" />
                            <Tooltip contentStyle={{backgroundColor: "#1e2939"}}/>
                            <Legend />
                            {selectedTeams.map((team, index) => (
                                <Line
                                    key={team}
                                    type="monotone"
                                    dataKey={team}
                                    stroke={`hsl(${index * 60}, 100%, 70%)`}
                                    strokeWidth={2}
                                    dot={showLogos ? <CustomDot /> : true}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center">Select one or more teams to build the plot</p>
                )}
            </div>
            <div className="mt-4 plot-box">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showLogos}
                        onChange={() => setShowLogos(!showLogos)}
                        className="form-checkbox text-[#821090]"
                    />
                    <span>Show team logos on graph</span>
                </label>
            </div>
            
            {/* Filters for the second plot */}
            <h1 className="text-4xl font-bold text-center mb-4">Single Season Comparison</h1>
            <p className="flex text-gray-300 items-center gap-4 mb-6 max-w-4xl">
                Combine and compare stats from all the teams in a selected season.
            </p>

            <div className="flex gap-4 mb-6 max-w-4xl">
                <div>
                    <p>Select season:</p>
                    <select
                        className="p-2 bg-[#280137] text-white rounded"
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                    >
                        <option value="">-- Select --</option>
                        {seasons.map((season) => (
                            <option key={season} value={season}>{season}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>Stat 1 (X-axis):</p>
                    <select
                        className="p-2 bg-[#280137] text-white rounded"
                        value={selectedStat1}
                        onChange={(e) => setSelectedStat1(e.target.value)}
                    >
                        {statOptions.map(stat => (
                            <option key={stat.value} value={stat.value}>{stat.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>Stat 2 (Y-axis):</p>
                    <select
                        className="p-2 bg-[#280137] text-white rounded"
                        value={selectedStat2}
                        onChange={(e) => setSelectedStat2(e.target.value)}
                    >
                        {statOptions.map(stat => (
                            <option key={stat.value} value={stat.value}>{stat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Scatter Chart */}
            <div className="w-full max-w-4xl h-96 bg-[#280137] p-6 rounded-lg shadow-lg plot-box">
                {selectedSeason !== "" ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="x" name={statLabelMap[selectedStat1]} stroke="white" type="number" tickFormatter={(tick: any) => tick.toString()} 
                            tickCount={10} />
                        <YAxis dataKey="y" name={statLabelMap[selectedStat2]} stroke="white" type="number" tickFormatter={(tick: any) => tick.toString()} 
                            tickCount={5}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Teams" data={filteredData} fill="#8884d8" shape={(props: any) => <CustomDot {...props} />} />
                    </ScatterChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center">Select a season to build the plot</p>
                )}
            </div>


            {/* Footer */}
            <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
                <p>Built with ❤️ using Django & Next.JS | © {year} Federico Dassiè</p>
                <div className="flex justify-center gap-4 mt-4">
                    <a href="https://dassoo.github.io" className="hover:text-white transition">🐙 About Me</a>
                    <a href="https://linkedin.com/in/federico-dassi%C3%A8" className="hover:text-white transition">🔗 LinkedIn</a>
                </div>
            </footer>
        </div>
    );
}
