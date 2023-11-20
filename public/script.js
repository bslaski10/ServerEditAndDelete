const getTeams = async () => {
    try {
        return await (await fetch("/api/teams/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showTeams = async () => {
    try {
        let teams = await getTeams();
        let teamsDiv = document.getElementById("team-list");
        teamsDiv.innerHTML = "";
        teams.forEach((team) => {
            const section = document.createElement("section");
            section.classList.add("team");
            teamsDiv.append(section);

            const a = document.createElement("a");
            a.href = "#";
            section.append(a);

            const h3 = document.createElement("h1");
            h3.innerHTML = `${team.name}`;
            a.append(h3);

            a.onclick = (e) => {
                e.preventDefault();
                displayDetails(team);
            };
        });
    } catch (error) {
        console.log(error);
    }
};


const displayDetails = (team) => {
    const teamDetails = document.getElementById("team-details");
    teamDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = `${team.name} - ${team.city}`;
    teamDetails.append(h3);

    const deleteLink = document.createElement("a");
    deleteLink.innerHTML = "	&#x2715;";
    teamDetails.append(deleteLink);
    deleteLink.id = "delete-link";

    const editLink = document.createElement("a");
    editLink.innerHTML = "&#9998;";
    teamDetails.append(editLink);
    editLink.id = "edit-link";

    const p = document.createElement("p");
    teamDetails.append(p);
    p.innerHTML = `Super Bowl Wins: ${team.superBowlWins}, Stadium: ${team.stadium}`;

    const playersList = document.createElement("ul");
    teamDetails.append(playersList);

    team.players.forEach((player) => {
        const li = document.createElement("li");
        playersList.append(li);
        li.innerHTML = player;
    });

    editLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-title").innerHTML = "Edit Team";
    };

    deleteLink.onclick = (e) => {
        e.preventDefault();
        deleteTeam(team);
    };
    
    populateForm(team);
};

const deleteTeam = async(team) => {
    let response = await fetch(`/api/teams/${team._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    showTeams();
    document.getElementById("team-details").innerHTML = "";
    resetForm();
}

const populateForm = (team) => {
    const form = document.getElementById("add-team-form");
    form._id.value = team._id;
    form.name.value = team.name;
    form.city.value = team.city;
    form.logo.value = team.logo;
    form.superBowlWins.value = team.superBowlWins;
    form.players.value = team.players.join(", ");
    form.stadium.value = team.stadium;
};

const addTeam = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-team-form");
    const formData = new FormData(form);
    let response;

    if (form._id.value == -1) {
        formData.delete("_id");

     response = await fetch("/api/teams", {
            method: "POST",
            body: formData
     });
    }
    else {
       console.log(formData);
        response = await fetch(`/api/teams/${team._id}`, {
            method: "PUT",
             body: formData
       });
    }


    if (response.status != 200) {
        console.log("Error posting data");
    }

    team = await response.json();

    if (form._id.value != -1) {
        displayDetails(team);
    }

        resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showTeams();
    
};

const resetForm = () => {
    const form = document.getElementById("add-team-form");
    form.reset();
    form._id.value = "-1";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add Team";
    resetForm();
};

window.onload = () => {
    showTeams();
    document.getElementById("add-team-form").onsubmit = addTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("transparent");
    };
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".dialog").classList.remove("transparent");
    document.querySelector(".dialog").classList.add("transparent");
});