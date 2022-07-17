// catch the selectors
const submitBtn = document.querySelector(".submit-repos");
const reposNameInp = document.querySelector(".repos-name");
const dataContainer = document.querySelector(".show-data");

// on user click by enter key
reposNameInp.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    if (reposNameInp.value == "") {
      Swal.fire({
        icon: "error",
        title: "Please Write Github Username",
        text: "Field Cannot Be Empty!",
      });
      dataContainer.innerHTML = `<span>Please Write Github Username</span>`;
    } else {
      fetchGithubRepos();
    }
  }
});

// on user click by mouse
submitBtn.addEventListener("click", () => {
  fetchGithubRepos();
});

async function fetchGithubRepos() {
  if (reposNameInp.value == "") {
    Swal.fire({
      icon: "error",
      title: "Please Write Github Username",
      text: "Field Cannot Be Empty!",
    });
    dataContainer.innerHTML = `<span>Please Write Github Username</span>`;
  } else {
    try {
      const reposFetch = await fetch(
        `https://api.github.com/users/${reposNameInp.value}/repos`
      );
      // if user enter invalid github username
      if (!reposFetch.ok) {
        Swal.fire({
          icon: "error",
          title: "Please Check Of Github Username",
          text: "There Is Are No Github Username Has This Name",
        }).then((answer) =>
          answer.isConfirmed ? location.reload() : location.reload()
        );
      }
      // get repo data
      const reposData = await reposFetch.json();
      setReposInPage(reposData);
    } catch (error) {
      error;
    }
  }
}

// append repos data to the page
function setReposInPage(reposData) {
  dataContainer.innerHTML = "";
  reposData.forEach((repo) => {
    const mainDiv = document.createElement("div");
    mainDiv.className =
      "repo-info p-3 mb-3 d-flex flex-wrap align-items-center justify-content-between";
    const repoNameText = document.createTextNode(repo.name);
    // append text to main div
    mainDiv.appendChild(repoNameText);

    // create repo starts & his option
    const repoStars = document.createElement("span");
    repoStars.className = "repo-stars rounded-2 text-white"
    const repoStarsText = document.createTextNode(
      `Stars : ${repo.stargazers_count}`
    );
    repoStars.appendChild(repoStarsText);
    mainDiv.appendChild(repoStars);

    // create repo link & his options
    const repoLink = document.createElement("a");
    repoLink.href = `https://github.com/${repo.owner.login}/${repo.name}`;
    repoLink.setAttribute("target", "_blank");
    repoLink.className = "visit-repo btn btn-Primary";
    const repoLinkText = document.createTextNode("Visit");
    repoLink.appendChild(repoLinkText);
    mainDiv.appendChild(repoLink);

    // append the main div to repos container
    dataContainer.appendChild(mainDiv);
  });
}
