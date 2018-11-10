import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../components/InputCustomizado';
import PubSub from 'pubsub-js';

class FormularioAutor extends Component {
    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' }
        this.enviaForm = this.enviaForm.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            contentType: 'application/json',
            dataType: "json",
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: (novaListagem) => {
                PubSub.publish('atualiza-lista-autores',novaListagem);
            },
            error: (erro) => {
                console.log("deu ruim");
            }
        });
    }

    onChange(evento) {
        this.setState({
            [evento.target.id]: evento.target.value
        });
    }

    render() {
        return (

            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <fieldset>
                        <InputCustomizado nomeLabel="Nome" id="nome" type="text" placeholder="Nome" value={this.state.nome} onChange={this.onChange} />
                        <InputCustomizado nomeLabel="Email" id="email" type="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                        <InputCustomizado nomeLabel="Senha" id="senha" type="password" placeholder="Senha" value={this.state.senha} onChange={this.onChange} />

                        <div className="pure-controls">
                            <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                        </div>
                    </fieldset>
                </form>
            </div>

        )
    }
}

class TabelaAutores extends Component {
    
    constructor() {
        super();
    }
    render() {
        return (
            <table className="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this.props.lista.map((autor) => {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default class AutorBox extends Component{
    constructor() {
        super();
        this.state = { lista: [] }
    }
    componentDidMount(){
     
        $.ajax({
          url:"https://cdc-react.herokuapp.com/api/autores",
          dataType:'json',
          success:(resposta)=>{
            this.setState({lista:resposta});
          }
        })
        PubSub.subscribe('atualiza-lista-autores', (topico,novaListagem)=>{
            this.setState({lista:novaListagem});
        })
     };

    render(){
        return(
            <div>
                <FormularioAutor/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        )
    }
}