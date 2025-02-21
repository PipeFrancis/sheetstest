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
  
  // Function to fetch and display the list of teams
  function fetchAndDisplayTeams() {
    // Reference to the 'teams' collection in Firestore
    db.collection("teams")
      .get()
      .then((querySnapshot) => {
        const teamsList = document.getElementById("teamsList");
        teamsList.innerHTML = ''; // Clear the current list
        
        querySnapshot.forEach((doc) => {
          const teamData = doc.data();
          const teamName = teamData.teamName;
          const players = teamData.players.map(player => player.name).join(", ");  // Join player names with commas
  
          const teamElement = document.createElement("div");
          teamElement.textContent = `${teamName} (${players})`;
  
          teamsList.appendChild(teamElement);  // Append the new team to the list
        });
      })
      .catch((error) => {
        console.error("Error fetching teams: ", error);
      });
  }
  
  // Submit button click event listener
  document.getElementById('submitTeam').addEventListener('click', function() {
    const teamName = document.getElementById('teamName').value.trim();
    const players = [];
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
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
  
    const teamData = {
      teamName: teamName,
      players: players,
      totalCost: totalCost
    };
  
    // Add the team to Firestore
    db.collection("teams").add(teamData)
      .then(() => {
        document.getElementById('message').textContent = 'Team successfully submitted!';
        fetchAndDisplayTeams();  // Refresh the list of teams
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
    fetchAndDisplayTeams();  // Fetch and display teams on page load
  };
  