// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLBZ2RuJbpBd1k3r2ScOYD6Nw_M-myOGo",
    authDomain: "provafantateams.firebaseapp.com",
    projectId: "provafantateams",
    storageBucket: "provafantateams.firebasestorage.app",
    messagingSenderId: "399338649165",
    appId: "1:399338649165:web:c33186d16ccb9946914e04"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Function to fetch and display the list of teams in alphabetical order (case insensitive)
  function fetchAndDisplayTeams() {
    db.collection("teams").orderBy("teamNameLower").get()
      .then((querySnapshot) => {
        const teamsList = document.getElementById("teamsList");
        teamsList.innerHTML = ''; // Clear the current list
  
        querySnapshot.forEach((doc) => {
          const teamData = doc.data();
          const teamName = teamData.teamName;
          const players = teamData.players.map(player => player.name).join(", ");
  
          const teamElement = document.createElement("div");
          teamElement.textContent = `${teamName} (${players})`;
  
          teamsList.appendChild(teamElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching teams: ", error);
      });
  }
  
  // Function to check if a team name already exists (case insensitive)
  function isTeamNameTaken(teamName) {
    return db.collection("teams").where("teamNameLower", "==", teamName.toLowerCase()).get()
      .then(querySnapshot => {
        return !querySnapshot.empty; // Returns true if a team with the same name exists
      });
  }
  
  // Submit button click event listener
  document.getElementById('submitTeam').addEventListener('click', async function() {
    const teamName = document.getElementById('teamName').value.trim();
    const players = [];
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
    if (!teamName) {
      document.getElementById('message').textContent = 'Team name cannot be empty.';
      return;
    }
  
    for (let i = 1; i <= 10; i++) {
      if (document.getElementById(`p${i}`).checked) {
        players.push({
          name: `Player ${i}`,
          cost: costs[i - 1]
        });
      }
    }
  
    if (players.length !== 3) {
      document.getElementById('message').textContent = 'Please select exactly 3 players.';
      return;
    }
  
    const totalCost = players.reduce((sum, player) => sum + player.cost, 0);
    if (totalCost > 20) {
      document.getElementById('message').textContent = 'Total cost exceeds $20. Please select players with a total cost under $20.';
      return;
    }
  
    // Check if team name is already taken (case insensitive)
    const teamExists = await isTeamNameTaken(teamName);
    if (teamExists) {
      document.getElementById('message').textContent = 'Team name already exists. Please choose a different name.';
      return;
    }
  
    const teamData = {
      teamName: teamName, // Original name for display
      teamNameLower: teamName.toLowerCase(), // Lowercase version for sorting
      players: players,
      totalCost: totalCost
    };
  
    // Add the team to Firestore
    db.collection("teams").add(teamData)
      .then(() => {
        document.getElementById('message').textContent = 'Team successfully submitted!';
        fetchAndDisplayTeams(); // Refresh the list of teams
        document.getElementById('teamName').value = '';
        for (let i = 1; i <= 10; i++) {
          document.getElementById(`p${i}`).checked = false;
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        document.getElementById('message').textContent = 'There was an error submitting your team.';
      });
  });
  
  // Load teams when the page is loaded
  window.onload = function() {
    fetchAndDisplayTeams();
  };
  