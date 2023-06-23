const getMatchData = (matchObj) => {
  matchObj = matchObj.data;

  if (!matchObj) {
    console.log("NULL DATA");
    return null;
  }

  const sanitizedData = matchObj.map((match) => {
    const sanitizedMatch = {
      "metadata" : match.metadata,
      "players" : {
        "red" : match.players.red,
        "blue" : match.players.blue
      },
      "teams" : match.teams
    }
    return sanitizedMatch;
  });
  
  return sanitizedData;
}

module.exports = getMatchData;