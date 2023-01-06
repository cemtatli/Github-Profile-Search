const APIURL = "https://api.github.com/users/";

const main = document.querySelector("#main");
const form = document.querySelector("#form");
const search = document.querySelector("#search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No profile with this username !");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}

function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card flex items-center justify-center p-8 m-4 bg-indigo-300 sm:flex-col sm:justify-center sm:items-center">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class=" avatar rounded-full w-[100px] h-[100px] border-4 border-indigo-500">
    </div>
    <div class="flex flex-col items-center justify-center text-indigo-900  font-semibold">
      <h2 class="cursor-pointer  font-semibold text-xl mt-2" >${userID}</h2> 
      ${userBio}
      <ul class="flex gap-4 justify-center items-center max-w-xs mb-4">
        <li class="flex items-center">${user.followers} <strong class=" text-base ml-2">Followers</strong></li>
        <li class="flex items-center">${user.following} <strong class=" text-base ml-2">Following</strong></li>
        <li class="flex items-center">${user.public_repos} <strong class=" text-base ml-2">Repos</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 8).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;

  if (user) {
    getUser(user);
    search.value = "";
  }
});
