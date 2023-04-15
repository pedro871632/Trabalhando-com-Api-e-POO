export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`
        return fetch(endpoint)
        .then(data =>{

            
            return data.json()
        } )
        .then(({login,name,public_repos,followers,id}) => ({
            login,
            name, 
            public_repos,
            followers,
            id
        }))
    }
}