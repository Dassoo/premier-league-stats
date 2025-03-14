export interface TeamStats {
    team: string;
    season: string;
    wins: number;
    losses: number;
    goals: number;
    goals_conceded: number;
    points: number;
    goal_fastbreak: number;
    total_tackle: number;
    interception: number;
    total_pass: number;
    backward_pass: number;
    [key: string]: string | number;
}

export interface TooltipProps {
    active?: boolean;
    payload?: any[];
}

export const filterStandings = (
    stats: TeamStats[], 
    selectedSeason: string, 
    searchQuery: string
): TeamStats[] => {
    return stats
        .filter((team) => team.season === selectedSeason)
        .filter((team) => team.team.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const pointsA = 3 * a.wins + (38 - a.wins - a.losses);
            const pointsB = 3 * b.wins + (38 - b.wins - b.losses);
            return pointsB - pointsA;
        });
};
