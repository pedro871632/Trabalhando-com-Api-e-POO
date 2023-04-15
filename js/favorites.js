import { GithubUser } from "./githubUser.js"




// classe que vai conter a logica dos dados
// como os dados serao estruturados

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()

       
    
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || []
    
        console.log(this.entries)

    }

    save(users){
       localStorage.setItem("@github-favorites",JSON.stringify(users)) 
    }

    async add(username) {
        try {
            const git = await GithubUser.search(username)
            if (git.login===undefined || this.entries.some(user => user.id === git.id)){

                console.log("deu ruim meu chapa")
                throw new Error("Usuario Inexistente ou ja contido !")

            }
            else {
                this.entries  =  [git,...this.entries]
                this.update()
                this.save(this.entries)          
            }        
        }
  
        catch(error){
            alert(error.message)
        }
        // console.log(username)
  

     }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)  
        this.entries = filteredEntries

        this.update()
        this.save(this.entries)
    }
}


// Classe que vai criar a visualizacao e eventos do html
export class favoritesView extends Favorites {
    constructor(root){
        super(root)

        this.update()

        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const {value} = this.root.querySelector(".search input")
            this.add(value)
        }
    }

    update() {
       this.removeAllTr()

       this.entries.forEach(user => {
        const row  = this.createRow()
       

        row.querySelector(".user img").src =`https://github.com/${user.login}.png/`

        row.querySelector(".user img").alt = `Imagem de ${user.name}`
        row.querySelector(".user span").textContent = user.name
        row.querySelector(".user p").textContent = user.name
        row.querySelector(".repository").textContent = user.public_repos

        row.querySelector(".user a").href = `https://github.com/${user.login}`  

        row.querySelector(".followers").textContent = user.followers

        row.querySelector(".remove").onclick = () => {
            const isOk = confirm("Tem certeza que deseja deletar essa linha?")
            if (isOk) {
               this.delete(user)
            }
        
        }
    
        this.tbody.append(row)
    })

  
    }

    createRow() {
        const tr = document.createElement("tr")
        tr.innerHTML = ` 
        <td class="user">
            <img src="https://avatars.githubusercontent.com/u/103895752?v=4" alt="">
            <a href="" target="_blank">
                <p>Pedro</p>
                <span></span>
            </a>
        </td>
        <td class="repository">
            12
        </td>
        
        <td class="followers">
            4324
        </td>

        <td>
            <button class="remove">&times;</button>
        </td>
        `
        return tr
    }

    removeAllTr(){
        this.tbody = this.root.querySelector("table tbody")
        this.tbody.querySelectorAll("tr")
        .forEach((tr)=> {
            tr.remove()
        }) 
    }
}



// Local Storage  =  um local que guarda informacao, como se fosse um banco de dados