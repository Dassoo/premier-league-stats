export const filterStandings = (stats, selectedSeason, searchQuery) => {
    return stats
    .filter((team) => team.season === selectedSeason)
    .filter((team) => team.team.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
        const pointsA = 3 * a.wins + (38 - a.wins - a.losses);
        const pointsB = 3 * b.wins + (38 - b.wins - b.losses);
        return pointsB - pointsA;
    });
}
