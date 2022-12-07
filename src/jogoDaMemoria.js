class JogoDaMemoria{

    constructor({tela, util}){
        this.tela = tela
        this.util = util

        this.pokemonsIniciais = [
            {img: './arquivos/zubat.png', nome: 'zubat'},
            {img: './arquivos/snorlax.png', nome: 'snorlax'},
            {img: './arquivos/psyduck.png', nome: 'psyduck'},
            {img: './arquivos/mew.png', nome: 'mew'}
        ]
        this.masterball = './arquivos/masterball.png'
        this.pokemonsEscondidos = []
        this.pokemonsSelecionados = []
    }

    inicializar(){
        this.tela.atualizarImagens(this.pokemonsIniciais)

        this.tela.configurarBotaoJogar(this.jogar.bind(this))
        this.tela.configurarClickVerificarSelecao(this.verificarSelecao.bind(this))
        this.tela.configurarBotaoMostrarTudo(this.mostrarPokemonsEscondidos.bind(this))
    }

    async embaralhar(){
        const copias = this.pokemonsIniciais.concat(this.pokemonsIniciais)

        .map(item =>{
            return Object.assign({}, item, { id: (Math.random() / 0.5)})
        })

        .sort(()=> Math.random() - 0.5)
        
        this.tela.atualizarImagens(copias)
        this.tela.exibirCarregando()
        
        const idIntervalo = this.tela.iniciarContador()

        await this.util.timeout(3000);
        
        this.tela.limparContador(idIntervalo)

        this.esconderPokemons(copias)
        this.tela.exibirCarregando(false)
    }
    //trocar as imagens dos pokemons pela masterball
    esconderPokemons(pokemons){
        const pokemonsOcultos = pokemons.map(({nome, id})=> ({
            id, 
            nome,
            img: this.masterball
        }))
        //atualizando a tela com os herois ocultos
        this.tela.atualizarImagens(pokemonsOcultos)

        //guardando os pokemons para trabalhar com eles depois
        this.pokemonsEscondidos = pokemonsOcultos 
    }
    exibirPokemons(nomeDoPokemon){
        const {img} = this.pokemonsIniciais.find(({nome}) => nomeDoPokemon === nome)
        this.tela.exibirPokemons(nomeDoPokemon, img)
    }

    verificarSelecao(id, nome) {
        const item = { id, nome}
        // alert(`Olá: ${nome}, id: ${id}`)
        const pokemonsSelecionados = this.pokemonsSelecionados.length
        switch(pokemonsSelecionados) {
            case 0: 
                this.pokemonsSelecionados.push(item)
                break;
            case 1: 
                const [ opcao1 ] = this.pokemonsSelecionados
                // zerar itens, para nao selecionar mais de dois
                this.pokemonsSelecionados = []
                if(opcao1.nome === item.nome && opcao1.id !== id) {                  
                    this.exibirPokemons(item.nome)

                    this.tela.exibirMensagem()
                    return;
                }
                this.tela.exibirMensagem(false)
                break;
        }
    }
    mostrarPokemonsEscondidos() {
        const pokemonsEscondidos = this.pokemonsEscondidos
        for (const pokemon of pokemonsEscondidos) {
            const { img } = this.pokemonsIniciais.find(item => item.nome === pokemon.nome)
            pokemon.img = img
        }
        this.tela.atualizarImagens(pokemonsEscondidos)
    }
    jogar(){
        this.embaralhar()
    }
}