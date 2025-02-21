// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBLBZ2RuJbpBd1k3r2ScOYD6Nw_M-myOGo",
    authDomain: "provafantateams.firebaseapp.com",
    projectId: "provafantateams",
    storageBucket: "provafantateams.firebasestorage.app",
    messagingSenderId: "399338649165",
    appId: "1:399338649165:web:c33186d16ccb9946914e04"
  };
  
  // Initialize Firebase App and Firestore
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  document.getElementById('submitTeam').addEventListener('click', function() {
    // Get team name
    const teamName = document.getElementById('teamName').value.trim();
  
    // Get selected players and their costs
    const players = [];
    const costs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  // Costs of players p1-p10
  
    for (let i = 1; i <= 10; i++) {
      if (document.getElementById(`p${i}`).checked) {
        players.push({
          name: `Player ${i}`,
          cost: costs[i - 1]
        });
      }
    }
  
    // Check if exactly 3 players were selected
    if (players.length !== 3) {
      document.getElementById('message').textContent = 'Please select exactly 3 players.';
      return;
    }
  
    // Calculate total cost of the team
    const totalCost = players.reduce((sum, player) => sum + player.cost, 0);
  
    // Check if total cost exceeds $20
    if (totalCost > 20) {
      document.getElementById('message').textContent = 'Total cost exceeds $20. Please select players with a total cost under $20.';
      return;
    }
  
    // Store the team data in Firestore
    const teamData = {
      teamName: teamName,
      players: players,
      totalCost: totalCost
    };
  
    db.collection("teams").add(teamData)
      .then(() => {
        document.getElementById('message').textContent = 'Team successfully submitted!';
        // Optionally, reset the form
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
  