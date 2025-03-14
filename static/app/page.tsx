"use client";
import { useState } from "react";
import Link from 'next/link';

export default function Home() {
    const [year] = useState(new Date().getFullYear());

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#1a011c] to-purple-950 text-white flex flex-col items-center p-6 font-[Radikal-bold]">
            
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

            {/* Hero Section */}
            <div className="text-center mt-12 flex flex-col items-center space-y-6">
                <h1 className="text-5xl font-extrabold text-white animate-fade-in">
                    Premier League Stats
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl animate-fade-in delay-200">
                    Explore data-driven insights from the Premier League (2006-2018) with interactive stats, standings, and visualizations.
                </p>
                <a href="#insights" className="px-6 py-3 bg-purple-600 hover:bg-purple-800 text-white rounded-lg shadow-lg transition-all">
                    Start Exploring →
                </a>
            </div>

            {/* Feature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                {features.map((feature) => (
                    <div key={feature.title} className="p-6 bg-[#3a004c] rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
                        <div className="text-4xl text-center">{feature.icon}</div>
                        <h3 className="mt-4 text-xl font-semibold text-center">{feature.title}</h3>
                        <p className="text-gray-300 text-center">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Showcase Graphs */}
            <div className="mt-16">
                <h2 id="insights" className="text-3xl text-center font-bold text-white insights">Explore Data Insights</h2>
                <div className="flex gap-6 mt-6 max-w-5xl">
                    <img src="/previews/leicester_1.jpg" className="w-120 rounded-lg shadow-lg" />
                    <div className="space-y-5">
                        <h3 className="text-xl">2015-2016: Just an historical success or also a sudden &ldquo;Big Four&rdquo; underperform?</h3>
                        <p className="text-gray-300">Claudio Ranieri&apos;s Leicester City achieved a first historical League title for the &ldquo;Foxes&rdquo;. 
                            Was it just a great achievement or also a sudden performance crisis of the historical big clubs? 
                        </p>
                        <Link href="/insights/insight1" className="px-6 py-3 bg-purple-600 hover:bg-purple-800 text-white rounded-lg shadow-lg transition-all">
                            See More
                        </Link>
                    </div>
                </div>
                <div className="flex gap-6 mt-6 max-w-5xl">
                    <img src="/previews/mc_1.jpg" className="w-120 rounded-lg shadow-lg" />
                    <div className="space-y-5">
                        <h3 className="text-xl">Manchester City&apos;s slow but steady emergence</h3>
                        <p className="text-gray-300">In 2012-2013, the &ldquo;Citizens&rdquo; won their first Premier League title in dramatic fashion, coming 
                            back from 8 points behind with six games left to win the title on goal difference. Since then, they increasingly marked
                            their presence in the league, leading to a second (2013/2014) and third (2017-2018) title, with the latest one inaugurating 
                            the foreseeable domination by Pep Guardiola&apos;s team.
                        </p>
                        <Link href="/insights/insight2" className="px-6 py-3 bg-purple-600 hover:bg-purple-800 text-white rounded-lg shadow-lg transition-all">
                            See More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10 footer-main">
                <p>Built with ❤️ using Django & Next.JS | © {year} Federico Dassiè</p>
                <div className="flex justify-center gap-4 mt-4">
                    <a href="https://dassoo.github.io" className="hover:text-white transition">🐙 About Me</a>
                    <a href="https://linkedin.com/in/federico-dassi%C3%A8" className="hover:text-white transition">🔗 LinkedIn</a>
                </div>
            </footer>
        </div>
    );
}

const features = [
    { title: "Data Visualization", description: "Interactive charts and stats.", icon: "📊" },
    { title: "Team Statistics", description: "Detailed team performance.", icon: "⚽" },
    { title: "Season Comparison", description: "Compare stats across seasons.", icon: "📅" },
    { title: "Custom Queries", description: "Filter and sort data based on criteria.", icon: "🔍" },
    { title: "User-Friendly UI", description: "Seamless navigation and insights.", icon: "🖥️" },
    { title: "Advanced Analytics", description: "Deeper insights with historical data.", icon: "📈" },
];
