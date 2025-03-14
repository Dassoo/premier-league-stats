"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CustomDot } from "@/utils/charts";
import { TeamStats, TooltipProps, filterStandings } from "@/utils/helpers";

export default function Home() {
    const [year] = useState(new Date().getFullYear());
    const [stats, setStats] = useState<TeamStats[]>([]);
    const [searchQuery] = useState("");
    const [selectedSeason] = useState("2015-2016");

    useEffect(() => {
        fetch(`https://premier-league-stats-gk6r.onrender.com/api/stats/data/?season=${selectedSeason}`)
            .then((res) => res.json())
            .then((data: TeamStats[]) => {
                console.log("Received data:", data);
                setStats(data);
            })
            .catch((err) => console.error("Fetching error:", err));
    }, [selectedSeason]);

    const seasonData = stats
        .filter((team) => team.season === selectedSeason)
        .map(team => ({
            ...team,
            wins: Number(team.wins),
            goal_fastbreak: Number(team.goal_fastbreak),
            tackles: Number(team.total_tackle),
            interceptions: Number(team.interception)
    }));

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const team = payload[0].payload.team;
            const wins = payload[0].value;
            const goalFastbreak = payload[1].value;
    
            return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
                    <p className="font-bold">{team}</p>
                    <p>Wins: {wins}</p>
                    <p>Counterattack Goals: {goalFastbreak}</p>
                </div>
            );
        }
        return null;
    };

    const CustomTooltip2: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const team = payload[0].payload.team;
            const tackles = payload[0].value;
            const interceptions = payload[1].value;
    
            return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
                    <p className="font-bold">{team}</p>
                    <p>Tackles: {tackles}</p>
                    <p>Interceptions: {interceptions}</p>
                </div>
            );
        }
        return null;
    };

    // Filter by season and search
    const filteredStandings = filterStandings(stats, "2015-2016", searchQuery).slice(0, 10);
    const filteredStandings2 = filterStandings(stats, "2016-2017", searchQuery).slice(0, 10);

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
            <div className="flex items-center gap-4 mb-3">
                <h1 className="text-2xl font-bold text-center text-white main-title">
                    2015-2016: Just an historical success or also a sudden &ldquo;Big Four&rdquo; underperform?
                </h1>
            </div>
            <p className="flex text-gray-300 items-center gap-4 mb-6 max-w-4xl">
                A brief analysis on Leicester City&apos;s sudden rise and downfall.
            </p>

            {/* Hero Banner */}
            <div className="relative max-w-4xl w-full mb-8">
                <img 
                    src="/previews/leicester_3.jpg" 
                    alt="Leicester City 2015-2016 goal celebration" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
            </div>

            {/* Text content */}
            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p>
                The 2015-2016 season will forever be remembered as one of the greatest sporting upsets in history, 
                as Leicester City won the Premier League title. 
                But which have been the actual factors that contributed to the small club&apos;s remarkable success?
                </p>

                <h3 className="text-xl text-white mt-6">Claudio Ranieri and strategic changes</h3>
                <p className="mt-2">
                    His reception was rather sceptical, also because of the recent and unsuccessful experience with the Greek 
                    national team, with his name considered one of the most likely to be sacked in the short term and the victory of 
                    the Premier League quoted by the bookmakers at 5000:1 (even less likely than the discovery of the Loch 
                    Ness monster, the landing of aliens on Earth and the facts that Elvis Presley is still alive, that Kim 
                    Kardashian is elected president of the United States or that Bono of U2 is appointed pope).
                </p>
                <p className="mt-3">
                But the Italian manager, appointed in the summer of 2015, did bring international experience and a reputation for 
                tactical acumen. His leadership played a pivotal role in galvanizing the team and implementing a successful strategy,
                which was mostly based on building a strong team ethos, with every player contributing to the collective effort, and
                a very swift and aggressive counter-attack strategy, utilizing their pace and agility to exploit their opponents&apos;
                defensive vulnerabilities.
                </p>
            </div>

            <div className="mt-6 w-full max-w-4xl h-100 bg-[#280137] p-6 rounded-lg shadow-lg">     
            {seasonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" dataKey="wins" name="Wins" stroke="#fff" label={{ 
                            value: "Wins", 
                            position: "insideBottom", 
                            offset: -5,
                            fill: "#fff",
                            fontSize: 14
                        }} />
                        <YAxis type="number" dataKey="goal_fastbreak" name="Counterattack Goals" stroke="#fff" label={{ 
                            value: "Counterattack Goals", 
                            angle: -90, 
                            offset: 15,
                            position: "insideLeft", 
                            fill: "#fff",
                            fontSize: 14
                        }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Teams" data={seasonData} fill="#8884d8" shape={(props: any) => <CustomDot {...props} />} />
                    </ScatterChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading chart...</p>
            )}
            </div>
            <p className="mt-1 text-center text-white text-sm">Counterattacking effectiveness analysis - PL 2015-2016</p>

            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p className="mt-8">
                    As we may notice from the above graph, counterattacks have been a dominant strategy for Leicester
                    City during the season. Surely some players were fundamental in achieving that, such as Jamie Vardy 
                    and Riyad Mahrez, being extremely prolific in goals and getting to top level numbers. Consequently 
                    to this aggressive playstyle, Leicester City also topped by far the leaderboard on penalty goals (10),
                    with the second being Watford at only 6!.
                </p>
            </div>
            
            <div className="mt-6 w-full max-w-4xl h-100 bg-[#280137] p-6 rounded-lg shadow-lg">     
            {seasonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" dataKey="tackles" name="Tackles" stroke="#fff" label={{ 
                            value: "Tackles", 
                            position: "insideBottom", 
                            offset: -5,
                            fill: "#fff",
                            fontSize: 14
                        }} />
                        <YAxis type="number" dataKey="interceptions" name="Interceptions" stroke="#fff" label={{ 
                            value: "Interceptions", 
                            angle: -90, 
                            offset: 0,
                            position: "insideLeft", 
                            fill: "#fff",
                            fontSize: 14
                        }} />
                        <Tooltip content={<CustomTooltip2 />} cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Teams" data={seasonData} fill="#8884d8" shape={(props: any) => <CustomDot {...props} />} />
                    </ScatterChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading chart...</p>
            )}
            </div>
            <p className="mt-1 text-center text-white text-sm">Defensive counter-interactions - PL 2015-2016</p>

            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p className="mt-8">
                    Leicester City was not just forward aggression, since we should not underestimate its 
                    strong midfield core, being the best filter in the league when it came to deny 
                    opponent attacks. Among all, surely N&apos;Golo Kantè emerged from the season as one of the 
                    best and most wanted midfielders in the world.
                </p>
                <p className="mt-3">
                    Finally, also keeper Kaspar Schmeichel provided lots of security in the back, maintaining a total 
                    of 15 clean sheets (4th) and having also a very high number of blocks (3rd) while not missing a minute 
                    in the Premier League that season.
                </p>
                
                <h3 className="mt-6 text-xl text-white">The other teams</h3>
                <p className="mt-2">
                    As we reflect on the standings, Leicester City&apos;s title win in the 2015-2016 season was indeed impressive, with the 
                    team maintaining a strong lead throughout the campaign. However, if we analyze the data, it becomes clear that the 
                    larger clubs were only temporarily unable to keep pace with Leicester&apos;s momentum. This temporary setback for the 
                    &ldquo;Big Six&rdquo; was evident in the following season, where Leicester struggled to replicate their success.
                </p>
            </div>

            {/* Tables */}
            <div className="flex flex-wrap justify-between w-full max-w-4xl gap-6 mt-8">
                <div className="w-full md:w-1/2 bg-[#38003c] rounded-lg max-w-sm font-[Radikal]">
                    <table className="w-full border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-[#280137]">
                            <tr className="text-gray-300">
                                <th className="p-3">#</th>
                                <th className="p-3 text-left">Team</th>
                                <th className="p-3">PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStandings.length > 0 ? (
                                filteredStandings.map((team, index) => {
                                    const logoPath = `/logos/${team.team.toLowerCase().replace(/\s+/g, "_")}.png`;

                                    return (
                                        <tr 
                                            key={index} 
                                            className={`border-b border-gray-700 transition duration-300 "hover:bg-gray-700"}`}
                                        >
                                            <td className="p-3 rounded-l-lg text-center">{index + 1}</td>
                                            <td className="p-3 flex items-center gap-3">
                                                <img src={logoPath} alt={team.team} className="w-8 h-8 object-contain" />
                                                {team.team}
                                            </td>
                                            <td className="p-3 text-center font-[Radikal-bold]">{(3 * team.wins) + (1 * (38 - team.wins - team.losses))}</td>
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
                    
                    <p className="p-3 bg-[#280137] text-center">Premier League 2015-2016 Standings (Top 10)</p>
                </div>

                <div className="w-full md:w-1/2 bg-[#38003c] rounded-lg max-w-sm font-[Radikal]">
                    <table className="w-full border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-[#280137]">
                            <tr className="text-gray-300">
                                <th className="p-3">#</th>
                                <th className="p-3 text-left">Team</th>
                                <th className="p-3">PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStandings2.length > 0 ? (
                                filteredStandings2.map((team, index) => {
                                    const logoPath = `/logos/${team.team.toLowerCase().replace(/\s+/g, "_")}.png`;

                                    return (
                                        <tr 
                                            key={index} 
                                            className={`border-b border-gray-700 transition duration-300 "hover:bg-gray-700"}`}
                                        >
                                            <td className="p-3 rounded-l-lg text-center">{index + 1}</td>
                                            <td className="p-3 flex items-center gap-3">
                                                <img src={logoPath} alt={team.team} className="w-8 h-8 object-contain" />
                                                {team.team}
                                            </td>
                                            <td className="p-3 text-center font-[Radikal-bold]">{(3 * team.wins) + (1 * (38 - team.wins - team.losses))}</td>
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

                    <p className="p-3 bg-[#280137] text-center">Premier League 2016-2017 Standings (Top 10)</p>
                </div>
            </div>

            <div className="mt-6 max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p className="mt-2">
                    Following their historic title victory, Leicester City managed to retain most of their key players, except for 
                    N&apos;Golo Kanté, who was sold to Chelsea for £32 million in the summer of 2016. Kanté&apos;s departure was significant, 
                    as he was a crucial component of Leicester&apos;s midfield, known for his tireless work ethic and ability to consistently 
                    deliver top performances.
                </p>
                <p className="mt-2">
                    In the 2016-2017 season, the &ldquo;Big Six&rdquo; clubs — Manchester City, Manchester United, Liverpool, Chelsea, Arsenal, and 
                    Tottenham Hotspur — quickly regained their positions at the top of the Premier League, especially after Chelsea and
                    Liverpool&apos;s downfall:
                </p>

                <ul className="list-disc list-inside space-y-4 mt-4">
                    <li>
                        <span className="font-semibold text-white">Chelsea</span>, the reigning champions, had a disastrous season, finishing 10th. 
                        This was a stark contrast to their dominant performance in the previous year, where they won the league under José Mourinho. 
                        The team struggled with consistency and form, leading to a managerial change mid-season, with Guus Hiddink taking over after 
                        Mourinho&apos;s departure. In the 2016-2017 season, Chelsea rebounded spectacularly under new manager Antonio Conte. The team adopted a 
                        3-4-3 formation, which proved highly effective, and they went on to win the Premier League title. The acquisition of N&apos;Golo Kanté 
                        from Leicester City was seen as a crucial factor in this success, as he brought a level of defensive solidity and energy that was missing the previous season.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Liverpool</span> had a mixed season, finishing 8th. They struggled with consistency under Brendan Rodgers, 
                        who was sacked early in the season. Jürgen Klopp took over and brought a new level of intensity and tactical awareness, 
                        but the team still failed to secure a European spot through league standings. Despite not achieving immediate success in terms 
                        of league position, Klopp&apos;s influence was evident in Liverpool&apos;s performances. They reached the Europa League final, where 
                        they lost to Sevilla, but the team showed signs of improvement and potential for future growth, which on the long run become able to achieve.
                    </li>
                </ul>
            </div>


            {/* Footer */}
            <footer className="mt-12 text-center text-gray-400 footer-main">
                <p>Built with ❤️ using Django & Next.JS | © {year} Federico Dassiè</p>
                <div className="flex justify-center gap-4 mt-4">
                    <a href="https://dassoo.github.io" className="hover:text-white transition">🐙 About Me</a>
                    <a href="https://linkedin.com/in/federico-dassi%C3%A8" className="hover:text-white transition">🔗 LinkedIn</a>
                </div>
            </footer>
        </div>
    );
}
