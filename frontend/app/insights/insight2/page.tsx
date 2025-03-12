"use client";
import { useState, useEffect } from "react";
import { Scatter, ScatterChart, ComposedChart, Line, LineChart, Legend, CartesianGrid, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { renderCustomAxisTick, CustomDot } from "@/utils/charts";
import { filterStandings } from "@/utils/helpers";


export default function Home() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState("2017-2018");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTeams, setSelectedTeam] = useState(["Manchester United", "Manchester City"]);
    const [showLogos, setShowLogos] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/stats/data/?season=${selectedSeason}`)
            .then((res) => res.json())
            .then((data) => {
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
    const filteredStandings = filterStandings(stats, "2017-2018", searchQuery).slice(0, 8);
    const filteredStandings2 = filterStandings(stats, "2011-2012", searchQuery).slice(0, 8);
    const seasons = [...new Set(stats.map((team) => team.season))].sort();

    const structuredData = seasons.map((season) => {
        let seasonData = { season };
        selectedTeams.forEach((team) => {
            const teamData = stats.find((entry) => entry.team === team && entry.season === season);
            seasonData[team] = teamData ? teamData["points"] : null;
        });
        return seasonData;
    });

    const seasonData = stats
        .filter((team) => team.season === selectedSeason)
        .map(team => ({
            ...team,
            total_pass: Number(team.total_pass),
            backward_pass: Number(team.backward_pass),
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload; // Get the whole team data object

            const team = data.team;
            const goals = data.goals || 0;
            const wins = data.wins || 0;
            const losses = data.losses || 0;
            const points = (3 * wins) + (1 * (38 - wins - losses));
    
            return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
                    <p className="font-bold">{team}</p>
                    <p>Points: {points}</p>
                    <p>Wins: {wins}</p>
                    <p>Goals: {goals}</p>
                </div>
            );
        }
        return null;
    };

    const CustomTooltip2 = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            const team = data.team;
            const passes = data.total_pass || 0;
            const bpasses = data.backward_pass || 0;
    
            return (
                <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
                    <p className="font-bold">{team}</p>
                    <p>Passes: {passes}</p>
                    <p>Backward Passes: {bpasses}</p>
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
                    <a href="/" className="font-semibold text-xl tracking-tight hover:text-[#821090] transition">Premier League Stats (2006-2018)</a>
                </div>

                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-md lg:flex-grow text-right">
                        <a href="/standings" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition mr-6">
                            Standings
                        </a>
                        <a href="/stats" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition mr-6">
                            Stats
                        </a>
                        <a href="/plots" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-[#821090] transition">
                            Plots
                        </a>
                    </div>
                </div>
            </nav>

            {/* Title */}
            <div className="flex items-center gap-4 mb-3">
                <h1 className="text-2xl font-bold text-center text-white main-title">
                    Manchester City's slow but steady emergence
                </h1>
            </div>
            <p className="flex text-gray-300 items-center gap-4 mb-6 max-w-4xl">
                From the first title to Premier League domination
            </p>

            {/* Hero Banner */}
            <div className="relative max-w-4xl w-full mb-8">
                <img 
                    src="/previews/mc_2.jpg" 
                    alt="Manchester City goal celebration" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
            </div>

            {/* Text content */}
            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p>
                    Since the early 2010s, Manchester City has evolved from an ambitious club 
                    to a dominant force in English football. Their journey, marked by dramatic victories, 
                    tactical revolutions, and record-breaking achievements, has redefined the Premier League 
                    landscape. What began as a historic title win in 2011-12 has since transformed into an era 
                    of sustained supremacy, with City consistently setting new benchmarks for excellence. 
                    We will explore their rise, the key figures behind their success, and the statistics 
                    that underlined their dominance.
                </p>

                <h3 className="text-xl text-white mt-10">The Turning Point: the 2011-12 Triumph</h3>
            </div>

            {/* Line Chart */}
            <div className="w-full max-w-4xl h-96 bg-[#280137] p-6 rounded-lg shadow-lg mt-4">
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
                                name="Points"
                                stroke={`hsl(${index * 200}, 100%, 70%)`}
                                strokeWidth={2}
                                dot={showLogos ? <CustomDot /> : true}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-white text-sm">The "Turning Point": as one Manchester side starts declining, the other one rises</p>

            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">    
                <p className="mt-6">
                    Manchester City’s rise to dominance began with the unforgettable 2011-12 season. 
                    Under Roberto Mancini, City won their first Premier League title in great fashion, 
                    overcoming an eight-point deficit in the final six games.
                </p>
                <p className="mt-2">
                    Tactically, Mancini’s City was built on a solid defensive structure, conceding only 
                    29 goals throughout the league campaign — the fewest in the division. The center-back 
                    partnership of Vincent Kompany and Joleon Lescott provided stability, while Joe Hart kept 
                    17 clean sheets, earning the Premier League Golden Glove.
                </p>
                <p className="mt-2">
                    In possession, City’s midfield was orchestrated by David Silva and Yaya Touré, who combined 
                    for 22 assists and controlled the tempo of games. Touré, in particular, played a box-to-box 
                    role, contributing both defensively and in attack with his 6.7 progressive carries per game.
                </p>
                <p className="mt-2">
                    City’s attack, led by Sergio Agüero, Edin Džeko, and Mario Balotelli, was the most potent in 
                    the league, scoring 93 goals. Agüero, in his debut season, netted 23 goals, supported by 
                    Balotelli’s efficiency—scoring a goal every 134 minutes. City’s pressing intensity was among 
                    the highest in the league, averaging 8.9 opposition passes per defensive action (PPDA), forcing 
                    turnovers and launching quick attacks.
                </p>
            </div>

            {/* Horizontal Composed Chart */}
            <div className="mt-6 w-full max-w-4xl h-100 bg-[#280137] rounded-lg shadow-lg">
                <ResponsiveContainer width="100%" height={filteredStandings2.length * 50}>
                    <ComposedChart 
                        data={filteredStandings2} 
                        layout="vertical" 
                        margin={{ top: 20, right: 50, left: 100, bottom: 20 }}
                    >
                        <YAxis 
                            dataKey="team" 
                            type="category" 
                            tick={renderCustomAxisTick} 
                            width={120} 
                        />
                        <XAxis type="number" stroke="#fff"/>
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                        <Legend verticalAlign="bottom" height={36} />
                        <Bar dataKey="points" name="Points" fill="#ff015b" barSize={20} stroke="#ff015b" />
                        <Line dataKey="goals" name="Goals" fill="#05f2ff" stroke="#05f2ff" />
                        <Line dataKey="wins" name="Wins" fill="yellow" stroke="yellow" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-white text-sm">Manchester City's first title, Top 8 standings - PL 2011-2012</p>

            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <h3 className="text-xl text-white mt-10">Consolidation and dominance</h3>
                <p className="mt-2">
                    Following their first triumph, City remained competitive, capturing a second league title in 
                    2013-14 under Manuel Pellegrini. That season, they outscored all teams (102 goals) and finished 
                    with 86 points, two ahead of Liverpool. Players like Yaya Touré (20 league goals), Vincent Kompany, 
                    and David Silva were instrumental. However, defensive inconsistencies and Chelsea’s resurgence in 
                    2014-15 prevented a successful title defense.
                </p>
                <p className="mt-2">
                    The arrival of Pep Guardiola in 2016 marked another turning point. After an initial adjustment season 
                    (3rd place, 78 points), City shattered records in 2017-18, securing 100 points — the first team in 
                    Premier League history to do so. Their dominance included:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-4">
                    <li>
                        <span className="font-semibold text-white">Most points (100)</span>
                    </li>
                    <li>
                        <span className="font-semibold text-white">Most wins (32)</span>
                    </li>
                    <li>
                        <span className="font-semibold text-white">Biggest title-winning margin (+19 over Manchester United)</span>
                    </li>
                    <li>
                        <span className="font-semibold text-white">Most goals scored (106)</span>
                    </li>
                </ul>
            </div>
            
            {/* Horizontal Composed Chart */}
            <div className="mt-6 w-full max-w-4xl h-100 bg-[#280137] rounded-lg shadow-lg">
                <ResponsiveContainer width="100%" height={filteredStandings.length * 50}>
                    <ComposedChart 
                        data={filteredStandings} 
                        layout="vertical" 
                        margin={{ top: 20, right: 50, left: 100, bottom: 20 }}
                    >
                        <YAxis 
                            dataKey="team" 
                            type="category" 
                            tick={renderCustomAxisTick} 
                            width={120} 
                        />
                        <XAxis type="number" stroke="#fff"/>
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                        <Legend verticalAlign="bottom" height={36} />
                        <Bar dataKey="points" name="Points" fill="#ff015b" barSize={20} stroke="#ff015b" />
                        <Line dataKey="goals" name="Goals" fill="#05f2ff" stroke="#05f2ff" />
                        <Line dataKey="wins" name="Wins" fill="yellow" stroke="yellow" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <p className="mt-1 text-center text-white text-sm">Manchester City's record season, Top 8 standings - PL 2017-2018</p>
        
            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed">
                <p className="mt-6">
                    Guardiola's management of Manchester City during the 2017-18 season marked a significant evolution in his 
                    tactical approach, particularly through the implementation of tiki-taka principles. This style emphasizes short 
                    passing and movement, maintaining possession, and creating triangles to facilitate fluid attacking play. 
                    Guardiola's tactical framework was built on a foundation of technical excellence and spatial awareness, fostering 
                    a culture where players were encouraged to understand their positional responsibilities deeply. 
                </p>
            </div>

            <div className="mt-6 w-full max-w-4xl h-100 bg-[#280137] p-6 rounded-lg shadow-lg">     
            {seasonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" dataKey="total_pass" name="Passes" stroke="#fff" label={{ 
                            value: "Passes", 
                            position: "insideBottom", 
                            offset: -5,
                            fill: "#fff",
                            fontSize: 14
                        }} />
                    <YAxis type="number" dataKey="backward_pass" name="Backward Passes" stroke="#fff" label={{ 
                            value: "Backward Passes", 
                            angle: -90, 
                            offset: 0,
                            position: "insideLeft", 
                            fill: "#fff",
                            fontSize: 14
                        }} />
                    <Tooltip content={<CustomTooltip2 />} />
                    <Scatter name="Teams" data={seasonData} fill="#8884d8" shape={<CustomDot />} />
                </ScatterChart>
            </ResponsiveContainer>
            ) : (
                <p>Loading chart...</p>
            )}
            </div>
            <p className="mt-1 text-center text-white text-sm">Pep Guardiola's "Tiki Taka" and building from the back tactics - PL 2017-2018</p>

            <div className="max-w-4xl text-gray-300 text-lg leading-relaxed text-content">
                <p className="mt-6">
                    Building from the back was another crucial aspect of Pep Guardiola's tactics. 
                    This approach, often referred to as "juego de posición" or positional play, emphasizes starting attacks from the 
                    goalkeeper and defenders, maintaining possession, and gradually moving the ball forward through midfield. Here 
                    are some key elements of how Manchester City built from the back:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-4">
                    <li>
                        <span className="font-semibold text-white">Goalkeeper's Role:</span> The signing of Ederson Moraes in the 
                        summer of 2017 was pivotal. Ederson's exceptional distribution skills allowed him to act as a sweeper-keeper, 
                        initiating attacks with precise long passes to bypass the press and find midfielders or full-backs in advanced 
                        positions.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Defensive Structure:</span> Manchester City often used a back four, 
                        but Guardiola also experimented with a back three in certain situations. The defenders were tasked with playing 
                        out from the back, using short passes to maintain possession and draw opponents into pressing, which would create 
                        space for City's midfielders to exploit.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Midfield Control:</span> Players like Kevin De Bruyne and David Silva 
                        were instrumental in controlling the build-up phase. They would drop deep to receive passes from the defenders, 
                        creating triangles and ensuring that City maintained possession while progressing the ball forward.
                    </li>
                    <li>
                        <span className="font-semibold text-white">Pressing Resistance:</span> City's ability to play through high 
                        presses was a significant improvement from the previous season. They developed a more cohesive unit that 
                        could withstand opposition pressure and transition quickly into counter-attacks once possession was regained.
                    </li>
                </ul>
                <p className="mt-6">
                    Manchester City's build-up play was characterized by patience, precision, and a deep understanding of spatial 
                    awareness, which allowed them to consistently dominate games and create scoring opportunities.
                </p>
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
