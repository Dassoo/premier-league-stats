"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { TeamStats } from "@/utils/helpers";

export default function Home() {
    const [year] = useState<number>(new Date().getFullYear());
    const [stats, setStats] = useState<TeamStats[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<string>("2017-2018");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("offensive");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    type CategoryKeys = keyof typeof categories;


    useEffect(() => {
        fetch(`https://premier-league-stats-gk6r.onrender.com/api/stats/data/?season=${selectedSeason}`)
            .then((res) => res.json())
            .then((data: TeamStats[]) => {
                console.log("Dati ricevuti:", data);
                setStats(data);
            })
            .catch((err) => console.error("Errore nel fetch dati:", err));
    }, [selectedSeason]);

    // Column names mapping
    const columnNames = {
        total_scoring_att: "Scoring Attempts",
        ontarget_scoring_att: "On Target",
        hit_woodwork: "Woodwork Hits",
        att_hd_goal: "Header Goals",
        att_pen_goal: "Penalty Goals",
        att_freekick_goal: "Freekick Goals",
        att_ibox_goal: "Inside Box Goals",
        att_obox_goal: "Outside Box Goals",
        goal_fastbreak: "Counterattack Goals",
        total_offside: "Offsides",

        clean_sheet: "Clean Sheets",
        outfielder_block: "Blocks",
        interception: "Interceptions",
        total_tackle: "Tackles",
        last_man_tackle: "Last Man Tackles",
        total_clearance: "Clearances",
        head_clearance: "Head Clearances",
        own_goals: "Own Goals",
        penalty_conceded: "Conceded Penalties",
        pen_goals_conceded: "Conceded Penalty Goals",

        total_pass: "Passes",
        total_through_ball: "Through Balls",
        total_long_balls: "Long Passes",
        backward_pass: "Backwards Passes",
        total_cross: "Crosses",
        corner_taken: "Corners Taken",

        total_yel_card: "Yellow Cards",
        total_red_card: "Red Cards",

        touches: "Touches",
        big_chance_missed: "Big Chances Missed",
        clearance_off_line: "Clearances Off Line",
        dispossessed: "Dispossessments",
        penalty_save: "Saved Penalties",
        total_high_claim: "High Claims (Keeper)",
    };

    // Categories
    const categories = {
        offensive: ["total_scoring_att", "ontarget_scoring_att", "hit_woodwork", "att_hd_goal", "att_pen_goal", "att_freekick_goal", "att_ibox_goal", "att_obox_goal", "goal_fastbreak", "total_offside"],
        defensive: ["clean_sheet", "outfielder_block", "interception", "total_tackle", "last_man_tackle", "total_clearance", "head_clearance", "own_goals", "penalty_conceded", "pen_goals_conceded"],
        teamplay: ["total_pass", "total_through_ball", "total_long_balls", "backward_pass", "total_cross", "corner_taken"],
        punishments: ["total_yel_card", "total_red_card"],
        others: ["touches", "big_chance_missed", "clearance_off_line", "dispossessed", "penalty_save", "total_high_claim"]
    };


    // Sort data
    const handleSort = (column: keyof TeamStats) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column as string);
            setSortOrder("desc");
        }
    };

    // Filter and order stats
    const filteredStats = stats
        .filter((team) => team.season === selectedSeason)
        .filter((team) => team.team.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (!sortColumn) return 0; // No initial sort
            const valueA = Number(a[sortColumn as keyof TeamStats]) || 0;
            const valueB = Number(b[sortColumn as keyof TeamStats]) || 0;
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;

        });

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

            {/* Main title */}
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-4xl font-bold text-center text-white main-title">
                    All Seasons Stats
                </h1>
            </div>
            <p className="flex text-gray-300 items-center gap-4 mb-1">Filter by season, team or order by column of interest. Refresh to reset board state.</p>
            <p className="flex text-gray-300 items-center gap-4 mb-6">Note: some stats related to older seasons may be missing due to data source limitation.</p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <p className="p-3">Select season:</p>
                <select
                    className="p-3 bg-[#280137] text-white rounded-lg shadow-lg focus:outline-none font-[Radikal]"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                >
                    {[...new Set(stats.map((team) => team.season))].map((season) => (
                        <option key={season} value={season}>
                            {season}
                        </option>
                    ))}
                </select>

                {/* Team search */}
                <input
                    type="text"
                    placeholder="Search team..."
                    className="p-3 bg-[#38003c] text-white rounded-lg shadow-lg focus:outline-none font-[Radikal]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Category Filters */}
            <div className="flex gap-4 mb-6">
                {Object.keys(categories).map((category) => (
                    <button
                        key={category}
                        className={`px-4 py-2 rounded-lg font-bold transition ${
                            selectedCategory === category ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-purple-500"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-[#38003c] rounded-lg w-full max-w-7xl font-[Radikal] table-div">
                <table className="w-full border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-[#280137]">
                        <tr className="text-gray-300">
                            <th className="p-3">#</th>
                            <th className="p-3 text-left min-w-xs">Team</th>
                            {categories[selectedCategory as CategoryKeys].map((stat) => (
                                <th
                                    key={stat}
                                    className="p-3 text-center cursor-pointer hover:text-purple-300"
                                    onClick={() => handleSort(stat)}
                                >
                                    {columnNames[stat as keyof typeof columnNames] || stat}{" "}
                                    {sortColumn === stat && (sortOrder === "asc" ? "▲" : "▼")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStats.length > 0 ? (
                            filteredStats.map((team, index) => {
                                const logoPath = `/logos/${team.team.toLowerCase().replace(/\s+/g, "_")}.png`;

                                return (
                                    <tr key={index} className="border-b border-gray-700 transition duration-300 hover:bg-gray-700">
                                        <td className="p-3 rounded-l-lg text-center">{index + 1}</td>
                                        <td className="p-3 flex items-center gap-3">
                                            <img src={logoPath} alt={team.team} className="w-8 h-8 object-contain" />
                                            {team.team}
                                        </td>
                                        {categories[selectedCategory as CategoryKeys].map((stat) => (
                                            <td key={stat} className="p-3 text-center">{team[stat]}</td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td className="p-6 text-center text-gray-400">Loading data...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
