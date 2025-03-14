"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { filterStandings } from "@/utils/helpers";
import { TeamStats } from "@/utils/helpers";

export default function Home() {
    const [year] = useState(new Date().getFullYear());
    const [stats, setStats] = useState<TeamStats[]>([]);
    const [selectedSeason, setSelectedSeason] = useState("2017-2018");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch(`https://premier-league-stats-gk6r.onrender.com/api/stats/data/?season=${selectedSeason}`)
            .then((res) => res.json())
            .then((data: TeamStats[]) => {
                console.log("Received data:", data);

                const updatedData = data.map(team => ({
                    ...team,
                    points: (3 * team.wins) + (1 * (38 - team.wins - team.losses))
                }));
    
                setStats(updatedData);
            })
            .catch((err) => console.error("Fetching error:", err));
    }, [selectedSeason]);

    // Filter by season and search
    const filteredStandings = filterStandings(stats, selectedSeason, searchQuery);

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
                    Final Standings
                </h1>
            </div>
            <p className="flex text-gray-300 items-center gap-4 mb-6 max-w-4xl">
                The Premier League standings from the 2006-2007 to the 2017-2018 seasons showcased an era of shifting power dynamics. 
                Initially dominated by the &ldquo;Big Four&rdquo; (Arsenal, Chelsea, Liverpool, and Manchester United), the league saw the emergence of 
                Manchester City as a major force, particularly after their title win in the 2011-2012 season. The &ldquo;Big Six&rdquo; eventually formed, 
                with Tottenham Hotspur joining the fray.
            </p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Season filter */}
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

            {/* Table */}
            <div className="overflow-x-auto bg-[#38003c] rounded-lg w-full max-w-4xl font-[Radikal] table-div">
                <table className="w-full border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-[#280137]">
                        <tr className="text-gray-300">
                            <th className="p-3">#</th>
                            <th className="p-3 text-left">Team</th>
                            <th className="p-3">W</th>
                            <th className="p-3">D</th>
                            <th className="p-3">L</th>
                            <th className="p-3">G</th>
                            <th className="p-3">CG</th>
                            <th className="p-3">+/-</th>
                            <th className="p-3">PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStandings.length > 0 ? (
                            filteredStandings.map((team, index) => {
                                const logoPath = `/logos/${team.team.toLowerCase().replace(/\s+/g, "_")}.png`;
                                const isChampion = index === 0; // First team
                                const isRelegated = index >= filteredStandings.length - 3; // Relegated teams

                                return (
                                    <tr 
                                        key={index} 
                                        className={`border-b border-gray-700 transition duration-300 ${
                                            isChampion
                                                ? "bg-gradient-to-r from-cyan-200 to-cyan-500 text-gray-900 font-bold"
                                                : isRelegated
                                                ? "bg-gradient-to-r from-red-500 to-red-700 bg-opacity-50"
                                                : "hover:bg-gray-700"
                                        }`}
                                    >
                                        <td className="p-3 rounded-l-lg text-center">{index + 1}</td>
                                        <td className="p-3 flex items-center gap-3">
                                            <img src={logoPath} alt={team.team} className="w-8 h-8 object-contain" />
                                            {team.team}
                                        </td>
                                        <td className="p-3 text-center">{team.wins}</td>
                                        <td className="p-3 text-center">{38 - team.wins - team.losses}</td>
                                        <td className="p-3 text-center">{team.losses}</td>
                                        <td className="p-3 text-center">{team.goals}</td>
                                        <td className="p-3 text-center">{team.goals_conceded}</td>
                                        <td className="p-3 text-center">{team.goals - team.goals_conceded}</td>
                                        <td className="p-3 text-center font-[Radikal-bold]">{team.points}</td>
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
