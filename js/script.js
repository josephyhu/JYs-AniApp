let accessToken = '{token}';
const url = 'https://graphql.anilist.co';
const login = document.querySelector('#login');
const main = document.querySelector('main');
let userId;
const btnList = document.querySelector('#btnList');
const btnPage = document.querySelector('#btnPage');
const btnSearch = document.querySelector('#btnSearch');
const section = document.querySelector('section');

let getAuthenticatedUserQuery = `
    query {
        Viewer {
            id
        }
    }`

fetch(url, {
    method: 'POST',
    headers: {
        "authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
        query: getAuthenticatedUserQuery
    }),
})
    .then(checkStatus)
    .then(res => res.json())
    .then(data => userId = data.data.Viewer.id)
    .catch(err => console.error('You have to be authenticated to use this app.', err))

function searchAnime(event, search, page = 1) {
    event.preventDefault();
    let query = `
        query ($page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    currentPage,
                    lastPage
                },
                media (type: ANIME, search: $search) {
                    id,
                    title {
                        romaji,
                    },
                    coverImage {
                        large
                    }
                }
            }
        }`
    let variables = {
        page: page,
        perPage: 10,
        search: search
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            let html = '';
            html += `<h2>Search results</h2><table><thead><tr><th>Cover</th><th>Anime</th></tr></thead><tbody>`
            for (let i = 0; i < data.data.Page.media.length; i++) {
                html += `<tr><td><img src=${data.data.Page.media[i].coverImage.large} alt="cover"></td>
                <td><a href="https://anilist.co/anime/${data.data.Page.media[i].id}" target="_blank">${data.data.Page.media[i].title.romaji}</a></td>`;
            }
            html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
            section.innerHTML = html;
        })
}

function searchManga(event, search, page = 1) {
    event.preventDefault();
    let query = `
        query ($page: Int, $perPage: Int, $search: String) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    currentPage,
                    lastPage
                },
                media (type: MANGA, search: $search) {
                    id,
                    title {
                        romaji,
                    },
                    coverImage {
                        large
                    }
                }
            }
        }`
    let variables = {
        page: page,
        perPage: 10,
        search: search
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            let html = '';
            html += `<h2>Search results</h2><table><thead><tr><th>Cover</th><th>Manga</th></tr></thead><tbody>`
            for (let i = 0; i < data.data.Page.media.length; i++) {
                html += `<tr><td><img src=${data.data.Page.media[i].coverImage.large} alt="cover"></td>
            <td><a href="https://anilist.co/manga/${data.data.Page.media[i].id}" target="_blank">${data.data.Page.media[i].title.romaji}</a></td>`;
            }
            html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
            section.innerHTML = html;
        })
}

btnSearch.addEventListener('click', e => {
    let type = document.querySelector('input[name="type"]:checked').value;
    let search = document.querySelector('#search').value;
    if (type === 'ANIME') {
        searchAnime(e, search)
    } else if (type === 'MANGA') {
        searchManga(e, search)
    }
});

btnPage.addEventListener('click', e => {
    let type = document.querySelector('input[name="type"]:checked').value;
    let search = document.querySelector('#search').value;
    let page = document.querySelector('#page').value
    if (type === 'ANIME') {
        searchAnime(e, search, page)
    } else if (type === 'MANGA') {
        searchManga(e, search, page)
    }
})

function getAnimeList(event, status, page = 1) {
    event.preventDefault();
    let query = `
        query ($userId: Int, $page: Int, $perPage: Int, $status: MediaListStatus) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    currentPage
                    lastPage
                },
                mediaList (userId: $userId, type: ANIME, status: $status)  {
                    media {
                        id,
                        title {
                            romaji,
                        },
                        coverImage {
                            large
                        }
                    },
                    progress,
                    score
                }
            }
        }`
    let variables = {
        userId: userId,
        page: page,
        perPage: 10,
        status: status
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            let html = '';
            html += `<h2>${status} ANIME</h2><table><thead><tr><th>Cover</th><th>Anime</th><th>Progress</th><th>Score</th></tr></thead><tbody>`
            for (let i = 0; i < data.data.Page.mediaList.length; i++) {
                html += `<tr><td><img src=${data.data.Page.mediaList[i].media.coverImage.large} alt="cover"></td>
                    <td><a href="https://anilist.co/anime/${data.data.Page.mediaList[i].media.id}" target="_blank">${data.data.Page.mediaList[i].media.title.romaji}</a></td>
                    <td>${data.data.Page.mediaList[i].progress}</td>
                    <td>${data.data.Page.mediaList[i].score}</td></tr>`;
            }
            html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
            section.innerHTML = html;
        })
        .catch(err => console.error('There was a problem. Try again.', err))
}

function getMangaList(event, status, page = 1) {
    event.preventDefault()
    let query = `
        query ($userId: Int, $page: Int, $perPage: Int, $status: MediaListStatus) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    currentPage
                    lastPage
                },
                mediaList (userId: $userId, type: MANGA, status: $status)  {
                    media {
                        id,
                        title {
                            romaji,
                        },
                        coverImage {
                            large
                        }
                    },
                    progress,
                    score
                }
            }
        }`
    let variables = {
        userId: userId,
        page: page,
        perPage: 10,
        status: status
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
        .then(checkStatus)
        .then(res => res.json())
        .then(data => {
            let html = '';
            html += `<h2>${status} MANGA</h2><table><thead><tr><th>Cover</th><th>Manga</th><th>Progress</th><th>Score</th></tr></thead><tbody>`
            for (let i = 0; i < data.data.Page.mediaList.length; i++) {
                html += `<tr><td><img src=${data.data.Page.mediaList[i].media.coverImage.large} alt="cover"></td>
                    <td><a href="https://anilist.co/manga/${data.data.Page.mediaList[i].media.id}" target="_blank">${data.data.Page.mediaList[i].media.title.romaji}</a></td>
                    <td>${data.data.Page.mediaList[i].progress}</td>
                    <td>${data.data.Page.mediaList[i].score}</td></tr>`;
            }
            html += `<tfoot>Page: ${data.data.Page.pageInfo.currentPage} of ${data.data.Page.pageInfo.lastPage}</tfoot></tbody></table>`
            section.innerHTML = html;
        })
        .catch(err => console.error('There was a problem. Try again.', err))
}

btnList.addEventListener('click', e => {
    let type = document.querySelector('input[name="type"]:checked').value;
    let status = document.querySelector('#status').value
    if (type === 'ANIME') {
        getAnimeList(e, status)
    } else if (type === 'MANGA') {
        getMangaList(e, status)
    }
});

btnPage.addEventListener('click', e => {
    let type = document.querySelector('input[name="type"]:checked').value;
    let status = document.querySelector('#status').value
    let page = document.querySelector('#page').value
    if (type === 'ANIME') {
        getAnimeList(e, status, page)
    } else if (type === 'MANGA') {
        getMangaList(e, status, page)
    }
})

function checkStatus(res) {
    if (res.ok) {
        login.innerHTML = '';
        return Promise.resolve(res);
    } else {
        main.innerHTML = '';
        return Promise.reject(new Error(res.statusText));
    }
}
