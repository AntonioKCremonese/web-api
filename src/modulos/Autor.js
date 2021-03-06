import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from '../components/InputCustomizado';
import PubSub from 'pubsub-js';
import TratamentoErro from '../modulos/TratamentoErro';

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
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ nome: '', email: '', senha: '' });
            },
            error: (erro) => {
                if (erro.status === 400) {
                    new TratamentoErro().publicaErro(erro.responseJSON);
                }

            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {});
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
                        <InputCustomizado name="nome" nomeLabel="Nome" id="nome" type="text" placeholder="Nome" value={this.state.nome} onChange={this.onChange} />
                        <InputCustomizado name="email" nomeLabel="Email" id="email" type="email" placeholder="Email" value={this.state.email} onChange={this.onChange} />
                        <InputCustomizado name="senha" nomeLabel="Senha" id="senha" type="password" placeholder="Senha" value={this.state.senha} onChange={this.onChange} />

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

export default class AutorBox extends Component {
    constructor() {
        super();
        this.state = { lista: [] }
    }
    componentDidMount() {

        $.ajax({
            url: "https://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: (resposta) => {
                this.setState({ lista: resposta });
            }
        })
        PubSub.subscribe('atualiza-lista-autores', (topico, novaListagem) => {
            this.setState({ lista: novaListagem });
        })
    };

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        )
    }
}